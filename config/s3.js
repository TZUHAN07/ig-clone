const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();

//初始化 S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file, folderName) => {
  const fileName = `${folderName}/${Date.now()}_${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

const deleteImageFromS3 = async (fileUrl) => {
  if (!fileUrl) return;

  const url = new URL(fileUrl);
  const key =url.pathname.substring(1);

  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);

    await s3.send(command);
  } catch (err) {
    console.log(err);
  }
};
module.exports = { uploadToS3, deleteImageFromS3 };
