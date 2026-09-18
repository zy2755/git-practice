# git-practice

用于 vs code。这里放的是个人主页「小睦聚合」的源码。

- 线上地址：https://xiaomu-home-97792.app.workbuddy.host/
- 本地预览：直接双击 `index.html`
- 文件分工：
  - `index.html` —— 页面结构 + 局部样式 + 时间/主题/入场动画脚本
  - `theme.css` —— 所有颜色、间距、字号等变量（换肤只改这里）
  - `data.js` —— 全部文案与链接（加条目只改这个文件，不用碰 index.html）
  - `og-image.js` —— 生成分享缩略图（canvas 现画 1200×630）
  - `bg-*.svg` —— 壁纸（浅色/深夜/暖米/薄荷，各分电脑横版和手机竖版）
  - `favicon.svg` / `favicon-32.png` / `apple-touch-icon.png` —— 站点图标
- 备份：大改之前，把整个目录复制一份成 `.bak_<说明>_<日期>\`（这类目录已被 `.gitignore` 忽略，不进仓库）
- 缓存：改了 `theme.css` 或壁纸后，**必须把引用处的 `?v=N` 加一**，否则浏览器不刷新（托管服务不下发缓存头）

---

## 更新记录

> 约定：每次改动都在这里记一笔，写清「时间 · 改了什么 · 为什么」。
> 最新的写在最上面。

### 2026-09-18 22:40 — 修 data.js 改文案不显示的问题，顺带把写法做得更宽松

- 现象：改 data.js 里「来在线看动漫」那条后，链接后面的「，这个速度还行」整段不显示。
- 原因：那一行写成了 `{ ..., linkText: "稀饭动漫", text: ",这个速度还行" }` —— 后面的内容借用了 `text` 这个字段名，但渲染时 `text` 只在链接**前面**显示，所以链接后的字就没地方放（另外句首逗号也应是中文的「，」）。
- 修法：改用 `tail` 字段写链接后面的内容 —— `tail: "，这个速度还行"`，显示为「这是稀饭动漫，这个速度还行」。
- 顺手增强：渲染脚本新增支持 `rest` 字段（一长句里把网址放 `link`、剩下的话直接放 `rest`，不用拆成前后两段），并在 `data.js` 顶部写清四个字段的用法和一个完整例子。
- 这类改动的排查口诀：**data.js 改完，先看"哪个字段名"有没有写对** —— 可用的就 `text` / `link` / `linkText` / `tail` / `rest` 五个，写错的字段不会报错，只会静静地不显示。

### 2026-09-18 22:14 — 借鉴「绮望·诗蔻蒂」档案站，做了一轮视觉与结构升级

参考站点：https://yiyuningye.top/skuld/#/home （Vue 3 全球版 + 手写 hash 路由的同人档案站）。
本轮采纳四件事，动手前整目录备份到 `.bak_借鉴改版前_20260918\`：

- 卡片改玻璃拟态：新增 `--c-card-bg` / `--c-card-border` 两个变量（四套皮肤各配一份），卡片由实心白改为半透明 + `backdrop-filter: blur(14px)`，悬停上浮幅度从 2px 提到 4px。
- 标题渐变字：新增 `.grad-text`（渐变 + `background-clip:text` + 9 秒缓慢流动），用在「小睦巨献」和「Hello, World!」上；渐变色取自主题变量，四套皮肤自动跟着变。
- 纯 CSS 光点背景：`body::before / ::after` 各铺一层重复的径向渐变圆点，26s / 44s 两档速度向上飘；配色由 `--dot-1~4` 变量控制（深夜模式换成淡紫金）。手机上自动停掉动画省电。
- 文案数据化：新增 `data.js`，导航项、四张卡片的文字与链接、页脚文案全搬进去；`index.html` 里加了一段渲染脚本照着数据铺卡片（data.js 没加载出来时，静态 HTML 兜底仍然可看）。
- 滚动入场动画：IntersectionObserver + `.reveal`/`.in` 纯 CSS `fadeUp`，导航/标题/时间/卡片依次错开 0.09s 出场；不支持该 API 的浏览器直接正常显示，不会白屏。
- 分享卡片：新增 `og:type/title/description/image` 与 `twitter:card`，`og-image.js` 用 canvas 现画一张 1200×630 的分享图（静态托管不给爬虫执行 JS，所以这张图的收益主要在支持 JS 的分享平台；真要百分百可靠就得让服务器返回静态图，暂缓）。
- 顺手补的细节：链接加 `-webkit-tap-highlight-color: transparent`，手机端 `#themeToggle` 收紧内边距，`prefers-reduced-motion` 里把光点、渐变字、入场动画一并关掉。
- 版本号：`theme.css?v=4`，四张老壁纸升到 `?v=4`，`data.js?v=1`、`og-image.js?v=1`。
- 验证：四套皮肤截图 + 交互实测（初始 light → 暖米 → 薄荷 → 深夜 → 再切回薄荷，导航 5 项、卡片 5 行、入场元素 7 个全部完成），并补了 430px 手机宽和 1400px 宽屏两张响应式截图；截图在 `D:\git克隆\皮肤配色预览_20260918\`（文件名带「改版后」的即是）。

### 2026-09-18 15:50 — 补全换肤变量，四套皮肤可选

- 备份：动手前把整个项目（除 `.git`）复制到 `.bak_皮肤补全前_20260918\`，`.gitignore` 新增 `.bak_*/` 规则。
- `theme.css`：暖米、薄荷两套皮肤各补上 `color-scheme: light`、`--c-accent-soft`（原先漏写，会静默继承雾蓝版的金色底）、以及各自的 `--bg-image`；手机端壁纸切换的媒体查询里补上 warm / mint 两条。
- 新增壁纸：`bg-pc-warm.svg`、`bg-mobile-warm.svg`、`bg-pc-mint.svg`、`bg-mobile-mint.svg`（结构同雾蓝版，只换渐变、光晕、光点配色）。
- `index.html`：页脚新增「皮肤预览」条（雾蓝 / 暖米 / 薄荷三个胶囊按钮）；底部脚本重写主题逻辑——`xm-theme` 记当前整套外观，`xm-skin` 记上次选的浅色皮肤，点「◐ 日间」会回到上次那套而不是固定回雾蓝；`localStorage` 读写统一走 `readLS`/`saveLS` 包装（修掉系统深浅色监听里缺 try 兜底的隐患）；`<head>` 防闪烁脚本加了合法皮肤白名单。
- 验证：无头浏览器截了四套配色各一张图，并模拟点击跑通「初始 light → 薄荷 → 暖米 → 深夜 → 回到暖米」；截图在 `D:\git克隆\皮肤配色预览_20260918\`。
- 16:05 已发布上线：`theme.css` 版本号升到 `?v=3`（4 张老壁纸同步升到 v3，新壁纸从 v1 起算），线上实测首页、theme.css、6 张壁纸全部 200。

### 2026-09-17 22:40 — 修线上「夜间按钮点了没反应」

- 排查结论：代码本身没问题，是浏览器 + CDN 缓存了旧文件（托管服务不下发 `cache-control` 头）。
- 处理：给全部静态资源加版本号 `?v=2`，重新发布；二次访问返回 304 但内容已是新版。
- 教训：以后改样式/壁纸，版本号必须加一。

### 2026-09-17 15:00 — 新增深色模式

- `theme.css` 增加深夜皮肤 `html[data-theme="dark"]`（含 `color-scheme: dark`，滚动条等系统控件一起变黑），`--bg-image` 壁纸变量化，手机竖版切换统一收到 theme.css 里。
- `index.html`：`<head>` 加防闪烁脚本（首帧前定好 `data-theme`）、导航右侧加「◐ 夜间 / 日间」切换按钮、底部脚本负责切换与记忆（默认跟随系统 `prefers-color-scheme`）。
- 新增夜空壁纸 `bg-pc-dark.svg`、`bg-mobile-dark.svg`。
- 顺带换域名重新发布：appId `wbapp_CmfttXSYgR2r7jXyqNqGhT`，新链接 https://xiaomu-home-97792.app.workbuddy.host/ ，旧链接（xiaomu-hub）已失效。

### 2026-09-16 — 仓库起步

- 建立 `git-practice` 仓库，主页雏形：顶部粘性导航、三列 grid 卡片、手机端单列媒体查询。
- 9/16 起陆续重构为 `theme.css` 变量驱动，建立 favicon（SVG + PNG 兜底 + 苹果主屏图标）。
