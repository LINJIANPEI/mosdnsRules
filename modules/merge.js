const fs = require("fs").promises;
const path = require("path");

/**
 * 合并文件夹内所有 .txt 文件，并去除重复行（无默认输出路径）
 * @param {string} folderPath - 包含 .txt 文件的文件夹路径
 * @param {string} outputFile - 输出文件路径（必需，必须显式指定）
 * @returns {Promise<number>} 去重后的总行数
 * @throws {Error} 如果未提供 outputFile 或文件夹中没有 .txt 文件
 */
async function mergeAndDedupeTxtFiles(folderPath, outputFile) {
  // 必须显式指定输出文件路径
  if (!outputFile) {
    throw new Error("必须指定输出文件路径（outputFile）");
  }

  // 读取文件夹中所有 .txt 文件
  const files = await fs.readdir(folderPath);
  const txtFiles = files.filter(
    (f) => path.extname(f).toLowerCase() === ".txt",
  );

  if (txtFiles.length === 0) {
    throw new Error(`文件夹 ${folderPath} 中没有 .txt 文件`);
  }

  const uniqueLines = new Map(); // 保持插入顺序

  for (const file of txtFiles) {
    const content = await fs.readFile(path.join(folderPath, file), "utf8");
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
