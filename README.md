# youth-pain-literature

一个专门生成「中文互联网青春疼痛文学」的 Codex Skill。

它想找回的不是今天精致、治愈、讲究情绪价值的 emo 文案，而是 2005～2015 年前后那种会被复制进 QQ 个性签名、空间日志、贴吧句子楼和同学录里的表达：有年代感，有点笨拙，真诚得过分，也矫情得刚刚好。

> 青春期的人第一次遇到普通的离开，却觉得这是世界上从未发生过的大事。

## 能做什么

- 从零生成句子吧短句、QQ 签名、空间日志和校园疼痛故事
- 校园小事叙事与旧贴吧抒情双路并存：支持分行、直接倾诉、浓烈比喻和有情绪推进的复沓
- 按 2005、2008、2010、2012、2015 或 `2020s-retro` 控制年代
- 处理遗憾、失恋、暗恋、毕业、友情、成长、雨天、夏天等复合情绪
- 将普通句子或现代小红书文案改写成旧互联网语感
- 一次生成多个真正不同的版本
- 可选轻度火星文和“青春疼痛 × 抽象”二创模式

## 实际生成效果

以下示例于 2026-09-03 在当前对话中加载新版 Skill 后生成，未使用子代理。每组展示完整提示词、参数和原样输出；README 没有对选用正文额外润色。这是当前对话生成示例，并非独立评测。

完整的 [试跑输入与输出](tests/runs/2026-09-03.json) 已保存，可用仓库校验脚本逐字核对。以下均未开启抽象二创或火星文（`huoxingwen` 未指定，默认 `false`）。

### 1. 青春遗憾短句 · 5 条

<details>
<summary>提示词与参数</summary>

<!-- D01:prompt -->
```text
使用 $youth-pain-literature
写 5 条青春遗憾短句，主题是毕业时没说出口的喜欢。兼有校园小事和直接倾诉，每条 2～5 句，不要全部用后来转折。

style=tieba
emotion=["graduation","secret-love","unspoken"]
era=2010
length=short
intensity=3
cringe=3
count=5
```
<!-- /D01:prompt -->

</details>

<!-- D01:output -->
```text
1. 散伙饭上，他们起哄让我说一个秘密。
你也跟着笑，我就临时换了一个。

2. 别祝我遇见更喜欢的人。
我喜欢你这件事，还没有说完。

3. 你能不能把那句再见说慢一点？
我还没想好，往后该用什么理由叫住你。

4. 喜欢像一根很短的火柴。
我护了它三年，还是没敢让你看见亮光。

5. 合照的时候我往你那边挪了一点，又挪了一点。
摄影师说别挤了，我才站好。
我能承认的，也就这么一点。
```
<!-- /D01:output -->

### 2. 老贴吧分行抒情 · 1 段

<details>
<summary>提示词与参数</summary>

<!-- D02:prompt -->
```text
使用 $youth-pain-literature
写一段旧贴吧式分行抒情，主题是你离开以后，我还不肯让回声停下来。允许浓烈比喻和有意复沓，100～180 字，不写校园或 QQ，不引用参考帖原句。

style=qzone
emotion=["departure","loneliness"]
era=2015
length=paragraph
intensity=4
cringe=4
count=1
```
<!-- /D02:prompt -->

</details>

<!-- D02:output -->
```text
别急着安静下来，
让我再叫你一次。
哪怕回来的只是回声，
哪怕它只会照着我的声音，
笨拙地，把你的名字还给我。
我知道你没有答应，
我知道这空荡荡的一切，并不是你留下来陪我的。
可我还是舍不得停。
声音一层一层低下去，
像一段不肯走完的长廊，
我追到最后，连自己都快听不清了，
还要对着那一点微弱的响动说：
别急，我在这里。
```
<!-- /D02:output -->

### 3. QQ 个性签名 · 3 条

<details>
<summary>提示词与参数</summary>

<!-- D03:prompt -->
```text
使用 $youth-pain-literature
写 3 条发现被删 QQ 好友的个性签名，每条 10～30 字，结构不同。

style=signature
emotion=["breakup","regret"]
era=2008
length=one-line
intensity=4
cringe=4
count=3
```
<!-- /D03:prompt -->

</details>

<!-- D03:output -->
```text
1. 连陌生人都能重新认识你，我却不能。

2. 验证消息写到一半，忽然不敢说我是谁。

3. 能不能晚一点忘记，我还没学会不找你……
```
<!-- /D03:output -->

### 4. QQ 空间独白 · 1 段

<details>
<summary>提示词与参数</summary>

<!-- D04:prompt -->
```text
使用 $youth-pain-literature
写一段 QQ 空间独白：有很多话想给一个人看，发布时却假装没有特定对象。100～200 字，最多两个旧互联网元素，不讲成长道理。

style=qzone
emotion=["secret-love","unspoken","midnight"]
era=2010
length=paragraph
intensity=3
cringe=3
count=1
```
<!-- /D04:prompt -->

</details>

<!-- D04:output -->
```text
这篇日志本来有个名字，打上去又觉得太明显，就删了。第一句也是，写了你的名字，后来改成了有些人。这样别人来看，只会觉得我又在乱写东西，你来看，大概也一样。我一边怕你看懂，一边又嫌自己写得不够明白。刚才预览了好几遍，专门挑出那些太像表白的话，删到最后，已经认不出我到底想说什么。可我还是把它发出来了。你要是问起，我就说随便写的。你不问的话，我今晚可能又要把那几句补回去。
```
<!-- /D04:output -->

### 5. 同一主题的强度对照

仅改变 `intensity`，主题与其他参数保持一致。

#### intensity=2

<details>
<summary>提示词与参数</summary>

<!-- D05-2:prompt -->
```text
使用 $youth-pain-literature
主题：分班后，仍能在楼道听见你的声音，却不再说话。写 2～5 句。

style=tieba
emotion=["regret","departure"]
era=2010
length=short
intensity=2
cringe=3
count=1
```
<!-- /D05-2:prompt -->

</details>

<!-- D05-2:output -->
```text
课间听见你在楼道里说话，我抬了一下头。
想问问你新同桌怎么样，又觉得你未必想说。
```
<!-- /D05-2:output -->

#### intensity=3

<details>
<summary>提示词与参数</summary>

<!-- D05-3:prompt -->
```text
使用 $youth-pain-literature
主题：分班后，仍能在楼道听见你的声音，却不再说话。写 2～5 句。

style=tieba
emotion=["regret","departure"]
era=2010
length=short
intensity=3
cringe=3
count=1
```
<!-- /D05-3:prompt -->

</details>

<!-- D05-3:output -->
```text
楼道里一听见你的声音，我就把要说的话准备好了。
可你从门口走过去，连我站起来都没有看见。
```
<!-- /D05-3:output -->

#### intensity=5

<details>
<summary>提示词与参数</summary>

<!-- D05-5:prompt -->
```text
使用 $youth-pain-literature
主题：分班后，仍能在楼道听见你的声音，却不再说话。写 2～5 句。

style=tieba
emotion=["regret","departure"]
era=2010
length=short
intensity=5
cringe=3
count=1
```
<!-- /D05-5:prompt -->

</details>

<!-- D05-5:output -->
```text
你的声音每天都经过这间教室，偏偏没有一句是来找我的。
那么窄的楼道，我竟要把整个青春喊破，才觉得你肯回头。
```
<!-- /D05-5:output -->

### 6. 现代文案 → 旧互联网表达

<details>
<summary>提示词与参数</summary>

<!-- D06:prompt -->
```text
使用 $youth-pain-literature
把下面的现代文案改成 2010 年 QQ 空间表达，100～200 字；保留想放手又舍不得的矛盾，不当人生建议，不虚构具体往事。
原文：停止内耗，允许关系自然流动，接住自己的情绪，成为更好的自己。

style=qzone
emotion=["departure","regret"]
era=2010
length=paragraph
intensity=3
cringe=3
count=1
```
<!-- /D06:prompt -->

</details>

<!-- D06:output -->
```text
我想，就写到这里吧。再往下写，又都是舍不得你的话，翻来覆去，连我自己都快背下来了。我也想装得没那么在乎，想明天一醒来就有别的事忙，不用总在心里问你为什么。可现在还不行。现在只要想到以后不再找你，我就想把刚才那句话划掉。你不用回来劝我，我怕你语气稍微好一点，我又误会。就让我一个人把这几行写完，难看也好，反悔也好，今晚先不要让你知道。
```
<!-- /D06:output -->

## 安装

把本仓库复制到 Codex skills 目录：

```bash
git clone https://github.com/lemon-neko/youth-pain-literature.git
cp -R youth-pain-literature "${CODEX_HOME:-$HOME/.codex}/skills/youth-pain-literature"
```

重新打开 Codex 后，可直接在自然语言请求中触发，也可以显式调用 `$youth-pain-literature`。

## 使用示例

自然语言：

```text
写 5 条毕业那年没表白的青春疼痛句子，像 2010 年贴吧句子吧。
```

显式参数：

```text
使用 $youth-pain-literature
theme=初中喜欢的人
style=qzone
emotion=[secret-love,summer,graduation]
era=2008
intensity=4
cringe=3
length=paragraph
```

改写：

```text
把“我偶尔会想起以前的朋友”改成 2010 年 QQ 空间日志，不要写得太成熟。
```

抽象二创：

```text
style=parody
主题：她删了我的 QQ
给我 3 条。
```

## 参数速查

| 参数 | 可选值 | 默认值 |
| --- | --- | --- |
| `style` | `tieba`、`qzone`、`signature`、`campus-fiction`、`regret`、`internet-nostalgia`、`hope-you-never-understand`、`pseudo-profound`、`parody` | `tieba` |
| `emotion` | 遗憾、失恋、暗恋、毕业、孤独、怀旧、友情、成长、离开、夏天、青春、深夜、下雨、重逢、没说出口等，可组合 | 按主题推断 |
| `era` | `2005`、`2008`、`2010`、`2012`、`2015`、`2020s-retro` | `2010` |
| `length` | `one-line`、`short`、`paragraph`、`post`、`story` | `short` |
| `intensity` | `1`～`5` | `3` |
| `cringe` | `1`～`5` | `3` |
| `huoxingwen` | `true` / `false` | `false` |

`parody` 和 `huoxingwen` 默认关闭，避免污染正常生成结果。

## 项目结构

```text
.
├── LICENSE
├── SKILL.md
├── agents/openai.yaml
├── references/
│   ├── styles.md
│   ├── imagery.md
│   ├── internet-culture.md
│   ├── era-guide.md
│   ├── language-patterns.md
│   ├── anti-ai-writing.md
│   ├── source-notes.md
│   └── examples.md
├── prompts/
│   ├── generate.md
│   ├── rewrite.md
│   ├── imitate-era.md
│   └── evaluate.md
└── tests/
    ├── cases.md
    ├── acceptance-output.md
    ├── validate_project.py
    └── runs/
        ├── 2026-09-03.json
        └── 2026-09-03-review.md
```

## 参考来源与范围

本轮参考了美文吧的[《我想用我的文字，和青春作伴》](https://tieba.baidu.com/p/3146320263)与长短句吧的[《你看南风吹，我等故人归》](https://tieba.baidu.com/p/4413356400)的部分楼主内容。它们不被标成“句子吧精品”，也不声称已读完整帖。

[来源笔记](references/source-notes.md)记录实际可见楼层、日期、未核实事项和写法分析，按需读取；不收录整帖原文。参考的是抒情节奏与组织方式，不是原句替换词语。

## 验证

```bash
python3 tests/validate_project.py
```

此脚本只检查引用、参数、42 组示例与九类覆盖、试跑数量和长度、明显重复片段，以及 README 与记录的逐字一致性；不能自动证明文风、原创性或质量评分。字数按汉字、字母、数字计，不含空白与标点；句数为标点近似检查。

本轮重跑了[原有七类及新增三类测试](tests/cases.md)，每类两次。生成与人工阅读式自检均由当前对话助手完成，不是独立评测。官方 Skill 结构校验及具体观察见[检查报告](tests/runs/2026-09-03-review.md)。初版三组输出保留为[历史基线](tests/acceptance-output.md)。

## 原创与版权

仓库中的 few-shot 示例均为本项目原创，不收录真实贴吧长帖、小说原文、歌词或大规模网络语料。Skill 学习的是句法、节奏、意象、媒介和情绪结构，而不是复刻具体作品。

一句话验收标准：

> 这句话如果出现在 2010 年的 QQ 空间，我会觉得违和吗？

如果答案是“会”，就还不够像。

## License

[MIT](LICENSE)
