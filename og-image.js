// 分享缩略图：用 canvas 现画一张 1200×630 的图（微信/QQ 分享卡片要的尺寸）
// 之所以现画而不是用 favicon-32.png：那张只有 32px，放大到分享卡片上会糊成一团。
// 这个文件只在 index.html 的 <head> 里同步跑一次，画完就把 og:image 填好，爬虫拿到的就是它。
(function () {
  try {
    var W = 1200, H = 630;
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d');

    // 背景：和壁纸呼应的浅雾蓝渐变
    var bg = g.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#f8fbfe');
    bg.addColorStop(1, '#e9f0f8');
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);

    // 两团柔和光晕，位置和 bg-pc.svg 一致
    var glow1 = g.createRadialGradient(W * 0.16, H * 0.86, 0, W * 0.16, H * 0.86, W * 0.6);
    glow1.addColorStop(0, 'rgba(91,140,199,0.20)');
    glow1.addColorStop(1, 'rgba(91,140,199,0)');
    g.fillStyle = glow1;
    g.fillRect(0, 0, W, H);

    var glow2 = g.createRadialGradient(W * 0.84, H * 0.12, 0, W * 0.84, H * 0.12, W * 0.5);
    glow2.addColorStop(0, 'rgba(201,162,39,0.18)');
    glow2.addColorStop(1, 'rgba(201,162,39,0)');
    g.fillStyle = glow2;
    g.fillRect(0, 0, W, H);

    // 几粒淡色光点
    g.fillStyle = 'rgba(91,140,199,0.14)';
    [[160, 130, 3], [420, 80, 2], [760, 190, 3], [1050, 110, 2],
     [250, 470, 2], [900, 520, 3], [1120, 380, 2]].forEach(function (p) {
      g.beginPath();
      g.arc(p[0], p[1], p[2], 0, Math.PI * 2);
      g.fill();
    });

    // 主标题
    g.textAlign = 'center';
    g.fillStyle = '#1b2430';
    g.font = '700 92px "Microsoft YaHei","PingFang SC",sans-serif';
    g.fillText('小睦巨献', W / 2, H / 2 - 10);

    // 副标题
    g.fillStyle = '#6b7a8b';
    g.font = '400 34px "Microsoft YaHei","PingFang SC",sans-serif';
    g.fillText('小睦聚合 · 链接 / 仪表盘 / 动漫 / 碎碎念', W / 2, H / 2 + 74);

    // 一条装饰细线
    g.strokeStyle = 'rgba(91,140,199,0.45)';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(W / 2 - 90, H / 2 + 118);
    g.lineTo(W / 2 + 90, H / 2 + 118);
    g.stroke();

    var url = c.toDataURL('image/png');
    document.querySelectorAll('meta[data-og-image]').forEach(function (m) {
      m.setAttribute('content', url);
    });
  } catch (e) {
    // 画不出来不是大事：静态托管本身也不给爬虫渲染页面，
    // 分享卡片只是顺手做的加分项，缺了不影响页面本身。
  }
})();
