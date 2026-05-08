const { downloadWithAxios } = require("./modules/download");
const { mergeAndDedupeTxtFiles } = require("./modules/merge");
const { removeLinesFromFile } = require("./modules/remove");

async function main() {
  try {
    // 国内列表
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/pmkol/easymosdns@rules/china_domain_list.txt",
      "china_domain_list.txt",
      "./cn_domain",
    );
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/pmkol/easymosdns@rules/china_ip_list.txt",
      "china_ip_list.txt",
      "./cn_ip",
    );
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/direct-list.txt",
      "direct-list.txt",
      "./cn_domain",
    );
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/china-list.txt",
      "china-list.txt",
      "./cn_domain",
    );
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/apple-cn.txt",
      "apple-cn.txt",
      "./cn_domain",
    );
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/google-cn.txt",
      "google-cn.txt",
      "./cn_domain",
    );

    // CDN列表
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/pmkol/easymosdns@rules/cdn_domain_list.txt",
      "cdn_domain_list.txt",
      "./cdn_domain",
    );

    // 国外列表
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/pmkol/easymosdns@rules/gfw_domain_list.txt",
      "gfw_domain_list.txt",
      "./nocn_domain",
    );
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/pmkol/easymosdns@rules/gfw_ip_list.txt",
      "gfw_ip_list.txt",
      "./nocn_ip",
    );
    await downloadWithAxios(
      "https://fastly.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/proxy-list.txt",
      "proxy-list.txt",
      "./nocn_domain",
    );
    await downloadWithAxios(
      "https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/gfw.txt",
      "gfw.txt",
      "./nocn_domain",
    );

    // 合并去重（必须加上 await，等待合并完成）
    await mergeAndDedupeTxtFiles("./file/cn_domain", "./rule/cn_domain.txt");
    await mergeAndDedupeTxtFiles("./file/cn_ip", "./rule/cn_ip.txt");
    await mergeAndDedupeTxtFiles("./file/cdn_domain", "./rule/cdn_domain.txt");
    await mergeAndDedupeTxtFiles(
      "./file/nocn_domain",
      "./rule/nocn_domain.txt",
    );
    await mergeAndDedupeTxtFiles("./file/nocn_ip", "./rule/nocn_ip.txt");

    // CDN去重
    await removeLinesFromFile("./rule/cdn_domain.txt", "./rule/cn_domain.txt");
    await removeLinesFromFile(
      "./rule/cdn_domain.txt",
      "./rule/nocn_domain.txt",
    );

    console.log("所有任务完成");
  } catch (err) {
    console.error("下载或处理失败:", err);
  }
}

main();
