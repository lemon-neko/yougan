# 有感 · yougan

**收集有趣的创意、值得停留的美和让人共鸣的瞬间。**

[打开有感](https://yougan.ronniesheppsdiv.chatgpt.site) · [分享一个发现](https://github.com/lemon-neko/yougan/issues/new/choose)

![有感原创：影子替广告牌上班](web/assets/shadow-ad.jpg)

有感是一个公开可浏览的创意、审美与共情集合地。从认真工作的冰箱和假装忙碌的微波炉开始，沿着作品流，遇见被树影接管的广告牌、盐放多了的午餐和借书的月亮。轻触改变作品，也可以只停一会儿。

## 这里有什么

- **十段连续作品**：七组原创动态表达，与三个实时视觉实验交替出现。自然滚动，随看随玩。
- **22 个发现**：七组原创作品、三个原创互动、三个动态实验、九个真实外部精选。
- **新作 · 微波炉在摸鱼**：[打开厨房小剧场](https://yougan.ronniesheppsdiv.chatgpt.site/#/item/microwave-slacking)。冰箱冻得梆硬，微波炉忙了几轮，饭还是那块冰。打开看看，它到底在忙什么。
- **三个实时动态作品**：[念头成云](https://yougan.ronniesheppsdiv.chatgpt.site/#/motion/thought-cloud)、[一颗安静的星球](https://yougan.ronniesheppsdiv.chatgpt.site/#/motion/quiet-sphere)、[绕着好奇心转](https://yougan.ronniesheppsdiv.chatgpt.site/#/motion/orbit-gallery)。支持改变观察角度、暂停和调速。
- **三条策展路线**：发现页从把日常看陌生、不用语言也能表达、换个位置看世界开始；专题里的每件作品都有一句观看提示。搜索或筛选后直接查看结果，条件可逐项移除。
- **打开就能玩**：心情调色盘可以下载小卡；创意碰撞机支持锁定元素；双视角故事邀请你换个位置读。
- **给喜欢留个位置**：全部 22 项内容可搜索和收藏，原来的作品链接与浏览器收藏继续有效。
- **照顾不同的观看方式**：全局暂停、系统减少动态效果、键盘操作和静态完整文字。
- **浏览能接得上**：段落导航可直达九件作品；从详情返回会恢复来源、位置和焦点。刷新后可选择继续停留，点品牌名称从首屏重新开始。
- **作品记得你的选择**：米饭接住一阵盐，纸箱旁留下碗或拖鞋，餐桌空位可出现一张纸条。同一标签页内保留这些选择，以及风向、各件展品的用途和月亮书签；手动暂停保存在当前浏览器。存储受限时仍能在本次页面操作。
- **接近时才动起来**：动态画面按需初始化，最多保留一个播放实例与一个预备实例，远离后释放；绘制持续吃力时逐级降低开销。

原创作品注明 AI 辅助创作；外部精选保留作者和原始链接。策展插画不是外部项目截图，资料核对及访问条件见 [来源记录](web/content/sources.md)。

## 本地预览

需要 Node.js 20.11 或更新版本，无需安装运行时依赖。

```bash
node --test tests/*.test.mjs
node scripts/build.mjs
node scripts/serve.mjs
```

打开终端显示的本地地址，默认 `http://127.0.0.1:4173`。页面使用 Hash 链接，内容地址可直接分享并刷新。

发现页沿用 `#/discover?format=website` 等组合筛选地址。作品流支持 `#/?scene=moon-library` 这样的段落地址。完整内容仍使用原有的 `#/item/:id` 和 `#/motion/:id` 地址。

## 内容与代码

- `web/content/catalog.json`：作品、精选、专题、编辑手记、动态实验，以及首页顺序与原创体验配置。
- `web/assets/`：原创作品和策展配图，[完整生成提示词](web/assets/artwork-prompts.md) 随项目保存。
- `web/app.js`、`web/core.js`、`web/styles.css`：页面、浏览行为与视觉样式；`web/discovery.css` 维护策展导览与按行浏览的网格。
- `web/scenes.js`、`web/scenes.css`：原创作品的呈现、轻互动、暂停与离屏管理；`web/domestic-art.js` 绘制餐盘、米饭、碗与拖鞋。
- `web/motion-lab.js`、`web/motion-geometry.js`：本地实时绘制、空间投影与动画生命周期；不依赖模型 API 或第三方播放器。
- 浏览恢复与标签页状态由 `web/journey.js`、`web/experience-state.js` 管理，动画激活与观看偏好由 `web/motion-state.js` 统一管理。
- `scripts/`：静态构建与本地预览；`tests/`：内容完整性及关键行为测试。
- `.openai/hosting.json`：Sites 站点标识和静态发布配置，不包含凭证。

无需账号、数据库或模型 API；收藏与小互动在浏览器内运行，不会上传到有感服务器。收藏不会跨设备同步。

[本次性能原始记录](tests/performance/2026-10-18.json) 保留同机本地测量样本；数据不代表所有浏览器或设备的表现。

## 一起收集

分享原始链接和让你停下来的理由即可。原创投稿、外部推荐与纠错经编辑核实后加入，详见 [贡献说明](CONTRIBUTING.md)。

[项目历史](HISTORY.md) 保留此前版本的入口。当前主分支维护内容网站。

[MIT License](LICENSE) · Copyright © 2026 lemon-neko
