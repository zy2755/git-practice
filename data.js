// 站点数据：所有文案集中在这里，改字只改这个文件，不用碰 index.html
// 加一条链接 / 一句碎碎念，直接往下面的数组里加一项就行。
// 每条链接的写法（四个字段，除了 text 都可以不写）：
//   text     —— 链接前面的话，比如 "这是"
//   link     —— 网址
//   linkText —— 链接上显示的字，比如 "稀饭动漫"
//   tail     —— 链接后面的话（连标点一起写），比如 "，这个速度还行"
// 例子：
//   { text: "这是", link: "https://xxx.com/", linkText: "某个网站", tail: "，还不错" }
//   → 显示成：这是某个网站，还不错
const siteData = {

  // 页面上出现的人物/站点名字，改一处全站生效
  brand: "小睦",
  homeTitle: "小睦巨献",
  pageTitle: "Hello, World!",

  // 顶部导航 + 卡片：顺序就是排列顺序，id 要和下面 cards 对应
  nav: [
    { id: "top",   name: "首页" },
    { id: "links", name: "一些小链接" },
    { id: "dash",  name: "仪表盘" },
    { id: "dongman", name: "动漫" },
    { id: "notes", name: "一些碎碎念" }
  ],

  cards: [
    {
      id: "links",
      title: "一些小链接",
      items: [
        { text: "欢迎参观", link: "https://space.bilibili.com/454697722?spm_id_from=333.1007.0.0", linkText: "小睦的B站首页" },
        { text: "这里是国内可用的", link: "https://fankuhub.com/", linkText: "动漫查询库" },
        { text: "看看", link: "https://mirrorchyan.com/zh/get-start", linkText: "Mirror酱" },
        { text: "我不要", link: "https://www.autohanding.com/", linkText: "手抄作业" },
        { text: "点击打开", link: "https://space.bilibili.com/67079745?spm_id_from=333.337.0.0", linkText: "玄离199的主页" }
      ]
    },
    {
      id: "dash",
      title: "仪表盘",
      items: [
        { text: "这里是", link: "https://platform.deepseek.com/usage", linkText: "DeepSeek开放平台" },
        { text: "这里是", link: "https://console.volcengine.com/ark/region:cn-beijing/subscription/coding-plan", linkText: "火山方舟" },
        { text: "这里是", link: "https://console.bce.baidu.com/ai-engine/speech/overview/index", linkText: "百度智能云" }
      ]
    },
    {
      id: "dongman",
      title: "来在线看动漫",
      items: [
        // tail 是"链接后面的尾巴文字"：会紧跟在链接后面显示。
        // 注意原文的逗号也算尾巴的一部分，所以要写进 tail 里。
        { text: "这是", link: "https://next.xifanacg.com/", linkText: "稀饭动漫", tail: "，这个速度还行" },
        { text: "这是", link: "https://www.gugu3.com/", linkText: "咕咕番" }
      ],
      // 卡里最后两句是纯文字（不带链接），单独放一个数组
      notes: [
        "不过还是推荐下载高清原片或在软件上看",
        "广告不会太多，而且相比更稳定"
      ]
    },
    {
      id: "notes",
      title: "一些碎碎念",
      notes: [
        "这是由我编辑的网页，我只有两岁",
        "请尽情挥洒您的创意！",
        "不知道是不是“芜湖起飞”的原因，不让代理"
      ]
    }
  ],

  footer: "本网站由超级小睦强力驱动",

  // 分享到微信/QQ 时显示的站点介绍（og:description 用）
  siteDesc: "小睦的个人主页：一些小链接、常用仪表盘、在线看动漫的地方，还有一些碎碎念。"
};
