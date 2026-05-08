const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function downloadWithAxios(url, filename, dir = "./") {
  const saveDir = path.join(__dirname, "../file", dir);
  ensureDir(saveDir);
  const dest = path.join(saveDir, filename);
  const writer = fs.createWriteStream(dest);

  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(`${filename} 下载完成`);
        resolve();
      });
      writer.on("error", (err) => {
        console.error(`${filename} 下载失败`);
        reject(err);
      });
      response.data.on("error", (err) => {
        console.error(`${filename} 下载失败`);
        reject(err);
      });
    });
  } catch (err) {
    console.error(`${filename} 下载失败`);
    throw err; // 仍然抛出错误，但不影响已打印的信息
  }
}

module.exports = { downloadWithAxios };
