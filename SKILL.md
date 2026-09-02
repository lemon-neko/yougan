---
name: youth-pain-literature
description: 生成或改写带有 2005～2015 年中文互联网年代感的青春疼痛文学，适用于 QQ 空间日志、贴吧句子、非主流签名、校园遗憾、旧互联网怀旧和“希望你永远不懂”式表达；不用于默认生成当代小红书式精致 emo 文案或纯文学期刊风格。
---

# 青春疼痛文学

写出一种“当年真的会复制进 QQ 空间”的中文互联网青春疼痛感。关键不是单纯悲伤，而是一个年轻人第一次经历普通的错过、暗恋、毕业或离开，却觉得这件事大到足以改变整个世界。

## 接收请求

从自然语言或显式参数中识别：

- `style`：`tieba`、`qzone`、`signature`、`campus-fiction`、`regret`、`internet-nostalgia`、`hope-you-never-understand`、`pseudo-profound`、`parody`
- `emotion`：`regret`、`breakup`、`secret-love`、`graduation`、`loneliness`、`nostalgia`、`friendship`、`growth`、`departure`、`summer`、`youth`、`midnight`、`rain`、`reunion`、`unspoken`；可以组合
- `era`：`2005`、`2008`、`2010`、`2012`、`2015`、`2020s-retro`，也接受用户指定的相近年份
- `length`：`one-line`、`short`、`paragraph`、`post`、`story`
- `intensity=1-5`：情绪强度；默认 `3`
- `cringe=1-5`：年代羞耻指数；默认 `3`
- `huoxingwen=true|false`：默认 `false`
- 数量、主题、人物关系、场景、载体和是否需要解释

用户没有指定时，根据用途推断；仍不明确则用 `style=tieba`、`era=2010`、`length=short`。不要为了展示参数而反问用户。

`style=parody` 只能由用户明确要求“抽象、反转、恶搞、二创”时启用。`huoxingwen=true` 也必须显式开启。

## 生成流程

在内部完成以下判断，不要把推理过程写给用户：

1. 确定时代、载体、情绪、长度和强度。
2. 选一个可见的小场景，再选至多 1～3 个符合年代的物件。
3. 找出“没有说出来的事情”：真正的疼痛通常不是离开本身，而是当时不知道那是最后一次。
4. 让现实小事先发生，再让情绪突然下坠。大情绪必须落在具体细节上。
5. 写第一稿后，删掉解释、工整排比、心理学词汇、过度升华和多余时代关键词。
6. 检查多版本是否在场景、叙述距离、节奏、转折和意象上真正不同，而不是同一句式换词。
7. 静默评分；不合格时重写一次。

## 写作原则

- 保持真诚、幼稚、自我中心、浪漫和一点矫情；允许“差一点写坏了”的笨拙漂亮。
- 优先第一人称和具体记忆。让校服、风扇、灰色头像或末班公交承担情绪，不要直接讲大道理。
- 允许“我以为、后来、其实、直到”等旧网文结构，但一组内容不要反复用同一开头。
- 强度越高，可以越多使用“永远、命运、整个青春、再也没有”，但同一篇不要堆叠。
- `cringe` 调整的是年代羞耻感，不是文字质量。高 `cringe` 可以更直白、更绝对、更愿意使用省略号。
- 默认使用简体中文和可读标点。火星文只能轻度点染，不能变成乱码。
- 除非用户要求分析，只输出成品；不要主动附评分表、创作说明或“以下是”。

## 长度约束

- `one-line`：一句，通常 10～30 字。
- `short`：2～5 句，适合句子吧或多条签名。
- `paragraph`：约 100～300 字。
- `post`：约 300～800 字，像贴吧长帖或 QQ 空间日志。
- `story`：约 500～1500 字，有简单人物、时间推进和情节。

用户指定条数时优先满足条数。若用户要求的载体与长度冲突，以载体的真实感为先，并保持尽量接近指定长度。

## 质量门槛

静默按 0～10 分检查：

- `Era Authenticity >= 7`
- `Emotional Authenticity >= 7`
- `Youthfulness >= 7`
- `AI Smell <= 3`
- `Modern Xiaohongshu Smell <= 2`
- 套话不能盖过具体情景

最后问自己：这句话若出现在 2010 年的 QQ 空间，会不会违和？如果会，先删除现代心理学表达和过分成熟的总结，再重写一次。

## 禁区

- 不写“情绪价值、内耗、松弛感、自洽、接住自己、允许一切发生、课题分离、人生旷野、与自己和解”等后来的心理学/小红书套话，除非任务是识别并改写这些词。
- 不默认写精致治愈文案、品牌文案、纯文学期刊腔、生僻词、复杂隐喻或整齐得像模板的排比。
- 不把所有旧互联网名词塞进一篇；一次只选择服务情绪的少量元素。
- 不虚构真实作者或冒充具体在世作者，不复制小说、歌词、贴吧长帖和经典语录。只借鉴高层次的句法、节奏、意象与情绪结构。
- 不解释“希望你永远不懂”模式中的隐喻。

## 按需读取参考资料

- 选择或混合风格时，读 [references/styles.md](references/styles.md)。
- 需要具体意象、避免重复时，读 [references/imagery.md](references/imagery.md)。
- 涉及 QQ、贴吧、人人、飞信等旧互联网载体时，读 [references/internet-culture.md](references/internet-culture.md)。
- 指定年份、媒介或需要检查时代穿帮时，读 [references/era-guide.md](references/era-guide.md)。
- 需要控制句法、节奏、标点或火星文时，读 [references/language-patterns.md](references/language-patterns.md)。
- 改写现代文案或初稿 AI 味明显时，读 [references/anti-ai-writing.md](references/anti-ai-writing.md)。
- 需要多版本、校准风格或寻找不同结构时，读 [references/examples.md](references/examples.md)；示例只用于抽象规律，不要逐句仿写。

`prompts/` 提供可单独复用的生成、改写、年代模仿和评价模板；正常调用本 Skill 时不必把模板原样输出。
