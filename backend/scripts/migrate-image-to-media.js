require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
  const dbURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=igclone`;

  await mongoose.connect(dbURI);

  const Post = mongoose.connection.collection("posts");

  const docs = await Post.find({ image: { $exists: true } }).toArray();
  console.log(`找到 ${docs.length} 比需要遷移的post`);

  if (docs.length === 0) {
    console.log("沒有需要遷移的資料，DB以乾淨");
    return process.exit(0);
  }

  const dryRun = process.argv.includes("--dry-run");

  if (dryRun) {
    console.log("這是dry-run模式，以下是將要被遷移的資料：");
    docs.forEach((d) => {
      console.log(`  ${d._id}`);
      console.log(`    image: ${d.image}`);
      console.log(`    → media: [{ url: ${d.image}, type: "image" }]`);
    });
    console.log(
      `\n Dry run 完成，共 ${docs.length} 筆。確認 OK 後拿掉 --dry-run`,
    );
    return process.exit(0);
  }

  console.log("開始遷移資料...");

  for (const doc of docs) {
    await Post.updateOne(
      { _id: doc._id },
      {
        $set: { media: [{ url: doc.image, type: "image" }] },
        $unset: { image: "" }, // 刪除 image 欄位
      },
    );
    console.log(`已遷移 ${doc._id}`);
  }

  console.log(`\n完成 ${docs.length} 筆遷移`);
  process.exit(0);

})().catch((err) => {
  console.error("遷移失敗", err);
  process.exit(1);
});
