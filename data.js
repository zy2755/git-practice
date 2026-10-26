// ============================================================================
// 站点数据：所有文案集中在这里，改字只改这个文件，不用碰 index.html
// ============================================================================
//
// 【怎么加一条链接】
//   往 cards 里对应卡片的 items 数组加一项。一项最多写五个字段（除了 text，其余都可省）：
//     text     —— 链接前面的话，比如 "这是"
//     link     —— 网址（**必须以 http:// 或 https:// 开头**，漏了协议点了会跳到本地去）
//     linkText —— 链接上显示的字，比如 "稀饭动漫"（不写就直接把网址显示出来）
//     tail     —— 链接后面的话（连标点一起写），比如 "，这个速度还行"
//     rest     —— 写法二：一整句里把网址放在 link，剩下的话全放 rest
//   例子：{ text: "这是", link: "https://xxx.com/", linkText: "某个网站", tail: "，还不错" }
//     → 显示成：这是某个网站，还不错
//
// 【怎么加一张卡片】
//   1) cards 里加一项：{ id: "xxx", title: "卡片标题", items: [...], notes: [...] }
//   2) nav 里也要加一项：{ id: "xxx", name: "导航上的名字" }   ← id 必须一模一样
//   两处对不上，症状是"点了导航没反应"。下面的"数据自查"会替你盯着这件事。
//
// ----------------------------------------------------------------------------
// 【信封模式 · 2026-10-15 新增】
//
// 以前每张卡片的默认值要靠消费方兜底：index.html 里得写 (card.items || []) 才不会炸；
// 想给所有卡片加一个公共字段（比如"默认折叠"），就得把每处消费点都改一遍。
//
// 现在改成先用 cardResultOf(payload) 套一层"信封"：
//   · 信封负责公共字段（id / title / items / notes）和默认值 —— 只解释一次
//   · payload 只管这张卡自己的内容；信封认得的键，payload 改不了（信封说了算）
//   · 信封不认得的键原样透传 —— 想给某张卡加专属字段，直接写，不用动信封
//
// 用起来你什么都不用多做：下面的数据照原样写就行，siteResultOf 会自动给每张卡套上信封。
// 想单独试一下，可以在浏览器控制台敲：cardResultOf({ id: "demo", title: "试试" })
// ============================================================================

// ----------------------------------------------------------------------------
// 一、信封工厂
// ----------------------------------------------------------------------------

/** 把任意值规整成字符串：null / undefined → ''，其余转成文本。 */
function textOf(value) {
  return value == null ? '' : String(value);
}

/** 把 payload 里信封不认得的键原样带过来（信封已认得的键不让它覆盖）。 */
function carryExtras(out, src) {
  Object.keys(src).forEach(function (key) {
    if (!(key in out)) out[key] = src[key];
  });
  return out;
}

/** 一条链接的信封：五个字段全部保证是字符串，缺省为 ''。 */
function linkResultOf(payload) {
  var src = payload || {};
  return carryExtras({
    text:     textOf(src.text),
    link:     textOf(src.link),
    linkText: textOf(src.linkText),
    tail:     textOf(src.tail),
    rest:     textOf(src.rest)
  }, src);
}

/** 一张卡片的信封：id / title 规整成文本，items / notes 保证是数组（绝不会是 undefined）。 */
function cardResultOf(payload) {
  var src = payload || {};
  return carryExtras({
    id:    textOf(src.id),
    title: textOf(src.title),
    items: Array.isArray(src.items) ? src.items.map(linkResultOf) : [],
    notes: Array.isArray(src.notes) ? src.notes.map(textOf) : []
  }, src);
}

/** 一个导航项的信封。 */
function navResultOf(payload) {
  var src = payload || {};
  return carryExtras({ id: textOf(src.id), name: textOf(src.name) }, src);
}

/** 一句问候语的信封：from 必须是数字，其余是文本。 */
function greetingResultOf(payload) {
  var src = payload || {};
  return carryExtras({
    from: Number.isFinite(src.from) ? src.from : 0,
    icon: textOf(src.icon),
    text: textOf(src.text),
    note: textOf(src.note)
  }, src);
}

// ----------------------------------------------------------------------------
// 二、数据自查：把"会对不上"的地方提前找出来
// ----------------------------------------------------------------------------
//
// 为什么是"收集成清单"而不是"发现就抛错"？
//
//   本地跑的 CLI 工具（契约漏了）抛错最省事：进程起不来，立刻就被发现。
//   但这里是在**浏览器里跑的网页**：抛错 = 整页白屏，访客一个字都看不到。
//   所以这里换个做法 —— 问题收集起来、在控制台大声说一遍，页面照常显示。
//
//   想手动看完整清单：浏览器控制台输入  __xiaomuAudit
//
// 每条问题长这样：{ level: 'warn' | 'info', code: '...', message: '说人话的解释' }
//   warn = 会真的出问题；info = 只是提醒，不影响显示。
function auditSite(data) {
  var problems = [];
  function add(level, code, message) {
    problems.push({ level: level, code: code, message: message });
  }

  // 1) 导航 → 卡片：每个导航都得有个落脚点（"top" 是回页首，天生没有卡片）
  var navIds = {};
  data.nav.forEach(function (item) {
    navIds[item.id] = true;
    if (!item.name) add('warn', 'nav-empty-name', '导航项 ' + (item.id || '(没写 id)') + ' 没写 name');
    if (item.id === 'top') return;
    var hit = data.cards.filter(function (card) { return card.id === item.id; }).length;
    if (!hit) {
      add('warn', 'nav-no-target',
        '导航「' + (item.name || item.id) + '」指向 #' + item.id + '，但没有这张卡片 —— 点了不会有反应');
    }
  });

  // 2) 卡片自身 + 卡片 → 导航（每张卡都得能在导航上点到）
  var seenId = {};
  data.cards.forEach(function (card) {
    if (!card.id) add('warn', 'card-empty-id', '有一张卡片没写 id，导航指不到它');
    if (!card.title) add('warn', 'card-empty-title', '卡片 ' + (card.id || '(没写 id)') + ' 没写 title');
    if (seenId[card.id]) add('warn', 'card-duplicate-id', '卡片 id 重复了：' + card.id + '（导航只会跳到第一个）');
    seenId[card.id] = true;
    if (card.id && !navIds[card.id]) {
      add('warn', 'card-not-in-nav', '卡片「' + card.title + '」的 id=' + card.id + ' 没出现在 nav 里 —— 导航上点不到它');
    }
  });

  // 3) 每条链接：协议漏了是最常见的坑（点了会跳到 file:// 或者当成相对路径）
  data.cards.forEach(function (card) {
    card.items.forEach(function (item, index) {
      var where = '卡片「' + card.title + '」第 ' + (index + 1) + ' 条';
      if (!item.link) {
        add('warn', 'item-no-link', where + '没写 link');
        return;
      }
      if (!/^https?:\/\//i.test(item.link)) {
        add('warn', 'item-bad-protocol', where + '的 link 必须以 http:// 或 https:// 开头，现在是：' + item.link);
      }
      if (!item.linkText) {
        add('info', 'item-no-linktext', where + '没写 linkText，页面上会直接把网址显示出来');
      }
    });
  });

  // 4) 问候语必须按 from 从小到大写
  //    updateGreeting() 取的是"最后一条 from 不大于当前小时"的记录，靠升序来兜底。
  //    顺序写反了不会报错，但会出现"某些时段显示错的那句"——很难肉眼发现，所以这里查一下。
  for (var i = 1; i < data.greetings.length; i++) {
    if (data.greetings[i].from < data.greetings[i - 1].from) {
      add('warn', 'greeting-out-of-order',
        'greetings 第 ' + (i + 1) + ' 条的 from=' + data.greetings[i].from + ' 比上一条小 —— 时段表必须按钟点升序写');
    }
  }

  // 5) 站点级字段：空了不会崩，但页面上会保留 index.html 里的静态兜底文字
  ['brand', 'homeTitle', 'pageTitle', 'footer', 'siteDesc'].forEach(function (key) {
    if (!data[key]) add('info', 'site-missing-' + key, '站点字段 ' + key + ' 是空的，页面上会保留静态兜底文字');
  });

  return { ok: problems.length === 0, problems: problems };
}

// ----------------------------------------------------------------------------
// 三、站点信封：自动给每个部件套上各自的信封，再跑一次自查
// ----------------------------------------------------------------------------
function siteResultOf(payload) {
  var src = payload || {};
  var data = {
    brand:     textOf(src.brand),
    homeTitle: textOf(src.homeTitle),
    pageTitle: textOf(src.pageTitle),
    siteDesc:  textOf(src.siteDesc),
    footer:    textOf(src.footer),
    nav:       (Array.isArray(src.nav) ? src.nav : []).map(navResultOf),
    greetings: (Array.isArray(src.greetings) ? src.greetings : []).map(greetingResultOf),
    cards:     (Array.isArray(src.cards) ? src.cards : []).map(cardResultOf)
  };
  data.audit = auditSite(data);
  return data;
}

// ----------------------------------------------------------------------------
// 四、数据本体：照原样写就行，信封在上面自动套
// ----------------------------------------------------------------------------
const siteData = siteResultOf({

  // 页面上出现的人物/站点名字，改一处全站生效
  brand: "小睦",
  homeTitle: "小睦巨献",
  pageTitle: "Hello, World!",

  // 顶部问候语：按"现在几点"自动换一句。
  //   from —— 从几点开始用这一条（含），一直到下一条的 from 之前；
  //          列表按钟点从小到大写，最后一条自然兜底到 23 点。
  //   icon —— 前面那个小图标；text —— 主问候；note —— 下面那行小注脚（不想写就留空字符串，整行会自动收起）。
  // 想换词、换时段、加节日彩蛋，只改这里，不用碰 index.html。
  greetings: [
    { from:  0, icon: "🌙", text: "夜深了", note: "怎么还没睡，早点休息吧" },
    { from:  5, icon: "🌅", text: "早上好", note: "新的一天，慢慢来" },
    { from:  9, icon: "☀️", text: "上午好", note: "再忙记得喝口水" },
    { from: 12, icon: "🍵", text: "中午好", note: "记得吃口热乎的" },
    { from: 14, icon: "🌤", text: "下午好", note: "撑住，快结束了" },
    { from: 18, icon: "🌆", text: "晚上好", note: "今天过得怎么样" },
    { from: 22, icon: "🌙", text: "夜深了", note: "忙完就早点休息" }
  ],

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
        { text: "这里是", link: "https://console.bce.baidu.com/ai-engine/speech/overview/index", linkText: "百度智能云" },
        { text: "这里是", link: "https://home.console.aliyun.com/home/dashboard/ProductAndService?spm=5176.28507329.J_4VYgf18xNlTAyFFbOuOQe.d_quick_access_5.16b08bb2xxt7Jf", linkText: "阿里云百炼" },
        { text: "这里是", link: "https://platform.xiaomimimo.com/console/plan-manage", linkText: "小米 MiMo" },
        { text: "这里是", link: "https://maas.xfyun.cn/modelService", linkText: "讯飞星辰" }
      ]
    },
    {
      id: "dongman",
      title: "来在线看动漫",
      items: [
        // tail 是"链接后面的尾巴文字"：会紧跟在链接后面显示。
        // 注意原文的逗号也算尾巴的一部分，所以要写进 tail 里。
        { text: "这是", link: "https://next.xifanacg.com/", linkText: "稀饭动漫", tail: "，这个速度还行" },
        { text: "这是", link: "https://gugu.fan/", linkText: "咕咕番" }
      ],
      // 卡里最后几句是纯文字（不带链接），单独放一个数组
      notes: [
        "不过还是推荐下载高清原片或在软件上看",
        "广告不会太多，而且相比更稳定",
        "记得配好屏蔽广告的插件"
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
});

// ----------------------------------------------------------------------------
// 五、把自查结果说一声（没问题就一个字都不输出）
// ----------------------------------------------------------------------------
// 手动查看完整清单：浏览器控制台输入  __xiaomuAudit
window.__xiaomuAudit = siteData.audit;

(function reportAudit() {
  var list = siteData.audit.problems;
  if (!list.length) return;	// 数据干净，安静走过
  var real = list.filter(function (p) { return p.level === 'warn'; }).length;
  console.warn('[小睦聚合] 数据自查：' + list.length + ' 处待确认，其中 ' + real + ' 处会真的出问题');
  list.forEach(function (p) {
    var line = '  [' + p.level + '] ' + p.message;
    if (p.level === 'warn') console.warn(line); else console.info(line);
  });
  console.warn('完整清单：控制台输入 __xiaomuAudit');
})();
