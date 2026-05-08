const fs = require("fs").promises;

/**
 * 删除文件二中所有出现在文件一中的行（原地修改文件二）
 * @param {string} file1Path - 参考文件路径（黑名单行集合）
 * @param {string} file2Path - 待清理文件路径
 * @returns {Promise<number>} 删除的行数
 * @throws {Error} 文件读取/写入失败时抛出
 */
async function removeLinesFromFile(file1Path, file2Path) {
  // 读取参考文件的行集合
  const content1 = await fs.readFile(file1Path, "utf8");
  const linesToRemove = new Set(content1.split(/\r?\n/));

  // 读取待清理文件
  const content2 = await fs.readFile(file2Path, "utf8");
  const originalLines = content2.split(/\r?\n/);
  const filteredLines = originalLines.filter(
    (line) => !linesToRemove.has(line),
  );
  const removedCount = originalLines.length - filteredLines.length;

  // 写回原文件
  await fs.writeFile(file2Path, filteredLines.join("\n"), "utf8");
  return removedCount;
}

module.exports = { removeLinesFromFile };
