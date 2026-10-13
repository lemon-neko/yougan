# 有感 · yougan

**收集有趣的创意、值得停留的美和让人共鸣的瞬间。**

[打开有感](https://yougan.ronniesheppsdiv.chatgpt.site) · [分享一个发现](https://github.com/lemon-neko/yougan/issues/new/choose)

![有感原创：用错用途博物馆](web/assets/wrong-use-museum.jpg)

有感是一个公开可浏览的创意、审美与共情集合地。打开一件作品，去一个陌生的网站，玩一次小实验，或者把喜欢的发现留给下一次。

## 这里有什么

- **18 个发现**：六组完整原创作品、三个原创互动、九个真实外部精选。
- **三个专题**：把日常看陌生、不用语言也能表达、换个位置看世界。
- **打开就能玩**：心情调色盘可以下载小卡；创意碰撞机支持锁定元素；双视角故事邀请你换个位置读。
- **给喜欢留个位置**：搜索与组合筛选、浏览器本地收藏、可分享的内容链接。

原创作品注明 AI 辅助创作；外部精选保留作者和原始链接。策展插画不是外部项目截图，资料核对及访问条件见 [来源记录](web/content/sources.md)。

## 本地预览

需要 Node.js 20.11 或更新版本，无需安装运行时依赖。

```bash
node --test tests/*.test.mjs
node scripts/build.mjs
node scripts/serve.mjs
```

打开终端显示的本地地址，默认 `http://127.0.0.1:4173`。页面使用 Hash 链接，内容地址可直接分享并刷新。

## 内容与代码

- `web/content/catalog.json`：作品、精选、专题与编辑手记。
- `web/assets/`：原创作品和策展配图，[完整生成提示词](web/assets/artwork-prompts.md) 随项目保存。
- `web/app.js`、`web/core.js`、`web/styles.css`：页面、浏览行为与视觉样式。
- `scripts/`：静态构建与本地预览；`tests/`：内容完整性及关键行为测试。
- `.openai/hosting.json`：Sites 站点标识和静态发布配置，不包含凭证。

无需账号、数据库或模型 API；收藏与小互动在浏览器内运行，不会上传到有感服务器。收藏不会跨设备同步。

## 一起收集

分享原始链接和让你停下来的理由即可。原创投稿、外部推荐与纠错经编辑核实后加入，详见 [贡献说明](CONTRIBUTING.md)。

[项目历史](HISTORY.md) 保留此前版本的入口。当前主分支维护内容网站。

[MIT License](LICENSE) · Copyright © 2026 lemon-neko
