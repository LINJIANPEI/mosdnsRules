const fs = require("fs").promises;
const path = require("path");

async function mergeAndDedupeTxtFiles(folderPath, outputFile) {
  if (!outputFile) {
    throw new Error("必须指定输出文件路径");
  }

  // 确保输出目录存在
  const outputDir = path.dirname(outputFile);
  await fs.mkdir(outputDir, { recursive: true });

  // 读取文件夹中的 TXT 文件
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

  // 合并、清洗、去重
  const uniqueLines = new Set();

  for (const filePath of txtFiles) {
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    for (let line of lines) {
      // 去除首尾空格
      line = line.trim();

      // 跳过空行和注释
      if (!line || line.startsWith("#")) {
        continue;
      }

      // 转换 +.example.com 为 example.com
      if (line.startsWith("+.")) {
        line = line.slice(2);
      }

      uniqueLines.add(line);
    }
  }

  // 写入文件
  const dedupedLines = Array.from(uniqueLines);

  await fs.writeFile(outputFile, dedupedLines.join("\n") + "\n", "utf8");

  console.log(
    `合并完成：${txtFiles.length} 个文件，${dedupedLines.length} 条规则`,
  );

  return dedupedLines.length;
}

module.exports = { mergeAndDedupeTxtFiles };
