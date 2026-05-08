const fs = require("fs").promises;
const path = require("path");

async function mergeAndDedupeTxtFiles(folderPath, outputFile) {
  if (!outputFile) throw new Error("必须指定输出文件路径");

  // 确保输出文件的目录存在
  const outputDir = path.dirname(outputFile);
  await fs.mkdir(outputDir, { recursive: true });

  // 读取文件夹中的所有 .txt 文件（过滤子目录）
  const files = await fs.readdir(folderPath);
  const txtFiles = [];
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const stat = await fs.stat(fullPath);
    if (stat.isFile() && path.extname(file).toLowerCase() === ".txt") {
      txtFiles.push(fullPath);
    }
  }

  if (txtFiles.length === 0) {
    throw new Error(`文件夹 ${folderPath} 中没有 .txt 文件`);
  }

  const uniqueLines = new Map();
  for (const filePath of txtFiles) {
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      if (!uniqueLines.has(line)) {
        uniqueLines.set(line, true);
      }
    }
  }

  const dedupedLines = Array.from(uniqueLines.keys());
  await fs.writeFile(outputFile, dedupedLines.join("\n"), "utf8");
  return dedupedLines.length;
}

module.exports = { mergeAndDedupeTxtFiles };
