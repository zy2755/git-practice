# git-practice

用于 vs code。这里放的是个人主页「小睦聚合」的源码。

- 线上地址：https://xiaomu-home-97792.app.workbuddy.host/
- 本地预览：直接双击 `index.html`
- 文件分工：
  - `index.html` —— 页面结构 + 局部样式 + 时间/主题切换脚本
  - `theme.css` —— 所有颜色、间距、字号等变量（换肤只改这里）
  - `bg-*.svg` —— 壁纸（浅色/深夜/暖米/薄荷，各分电脑横版和手机竖版）
  - `favicon.svg` / `favicon-32.png` / `apple-touch-icon.png` —— 站点图标
- 备份：大改之前，把整个目录复制一份成 `.bak_<说明>_<日期>\`（这类目录已被 `.gitignore` 忽略，不进仓库）
- 缓存：改了 `theme.css` 或壁纸后，**必须把引用处的 `?v=N` 加一**，否则浏览器不刷新（托管服务不下发缓存头）

---

## 更新记录

> 约定：每次改动都在这里记一笔，写清「时间 · 改了什么 · 为什么」。
> 最新的写在最上面。

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
