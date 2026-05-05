const sharp = require("sharp");

const resizeImage = async (buffer) => {
  const originalSize = buffer.length / 1024;

  try {
    const resizedBuffer = await sharp(buffer)
      .resize({
        height: 1920,
        width: 1080,
        fit: "cover",
        position: "center",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 75,
      })
      .toBuffer();

    const newSize = resizedBuffer.length / 1024;

    if (newSize > originalSize) {
      return buffer;
    }

    return resizedBuffer;
  } catch (err) {
    console.error("圖片處理失敗：", err);
    return buffer;
  }
};

module.exports = { resizeImage };
