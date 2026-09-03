![夏日黄昏里的旧电脑与一本还没写完的笔记](assets/readme-cover.png)

# 青春疼痛文学

`youth-pain-literature` · Codex Skill · 简体中文 · [MIT](LICENSE)

> 把语气调回 2010，把那句“算了”先删掉。

头像亮了又暗，空间日志写了又删。课间只有十分钟，喜欢一个人倒像过了好多年。

这是一个写中文互联网青春疼痛文学的小 Skill。给它一个主题，它会试着找回 2005～2015 年前后，QQ 签名、空间日志、贴吧句子楼里那种认真得有点好笑、现在看又有点舍不得的语气。

可以写一场没赶上的放学，也可以什么故事都不讲，只对着夜晚多按几次回车。至于矫情到什么程度——旋钮交给你。

[先看效果](#examples) · [安装](#installation) · [怎么用](#usage) · [参数](#parameters) · [一起写](#contributing)

## 可以拿它写点什么

- **短句和签名**：暗恋、毕业、被删好友。字数可以少，心事不一定。
- **独白和故事**：校园小事、QQ 空间日志，或者一段旧贴吧式的分行抒情。
- **改写和多版本**：把今天的文案换个年代说，再试试克制、伤感、放学后天都塌了的不同档位。

九种风格、42 组原创参考例子。火星文和抽象二创都有，但默认关着，放心点开。

<a id="examples"></a>

## 实际生成效果

先不讲原理，看看它会写出什么。

<details>
<summary>这些句子从哪来？</summary>

下面六组来自 2026-09-03 的当前对话试跑：读取新版 Skill 后直接生成，没有使用子代理。提示词、参数和输出都留在了[原始记录](tests/runs/2026-09-03.json)里；这里只调整展示排版，正文没有额外润色。它们是生成示例，不是独立评测，也不是参考帖摘抄。

每组的“提示词与参数”都能展开复制。以下示例均未开启抽象二创，`huoxingwen` 未指定，默认 `false`。

</details>

### 青春遗憾短句 · 五条装

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
> 1. 散伙饭上，他们起哄让我说一个秘密。<br>
> 你也跟着笑，我就临时换了一个。
>
> 2. 别祝我遇见更喜欢的人。<br>
> 我喜欢你这件事，还没有说完。
>
> 3. 你能不能把那句再见说慢一点？<br>
> 我还没想好，往后该用什么理由叫住你。
>
> 4. 喜欢像一根很短的火柴。<br>
> 我护了它三年，还是没敢让你看见亮光。
>
> 5. 合照的时候我往你那边挪了一点，又挪了一点。<br>
> 摄影师说别挤了，我才站好。<br>
> 我能承认的，也就这么一点。
<!-- /D01:output -->

### 旧贴吧分行抒情 · 回车键也有心事

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
> 别急着安静下来，<br>
> 让我再叫你一次。<br>
> 哪怕回来的只是回声，<br>
> 哪怕它只会照着我的声音，<br>
> 笨拙地，把你的名字还给我。<br>
> 我知道你没有答应，<br>
> 我知道这空荡荡的一切，并不是你留下来陪我的。<br>
> 可我还是舍不得停。<br>
> 声音一层一层低下去，<br>
> 像一段不肯走完的长廊，<br>
> 我追到最后，连自己都快听不清了，<br>
> 还要对着那一点微弱的响动说：<br>
> 别急，我在这里。
<!-- /D02:output -->

### QQ 签名 · 字数有限，心事超标

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
> 1. 连陌生人都能重新认识你，我却不能。
>
> 2. 验证消息写到一半，忽然不敢说我是谁。
>
> 3. 能不能晚一点忘记，我还没学会不找你……
<!-- /D03:output -->

### QQ 空间独白 · 假装只是随便写写

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
> 这篇日志本来有个名字，打上去又觉得太明显，就删了。第一句也是，写了你的名字，后来改成了有些人。这样别人来看，只会觉得我又在乱写东西，你来看，大概也一样。我一边怕你看懂，一边又嫌自己写得不够明白。刚才预览了好几遍，专门挑出那些太像表白的话，删到最后，已经认不出我到底想说什么。可我还是把它发出来了。你要是问起，我就说随便写的。你不问的话，我今晚可能又要把那几句补回去。
<!-- /D04:output -->

### 同一句心事，三档音量

还是分班后在楼道听见那个人的声音。主题和其他参数不动，只把 `intensity` 从 2 拧到 3，再拧到 5。

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
> 课间听见你在楼道里说话，我抬了一下头。<br>
> 想问问你新同桌怎么样，又觉得你未必想说。
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
> 楼道里一听见你的声音，我就把要说的话准备好了。<br>
> 可你从门口走过去，连我站起来都没有看见。
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
> 你的声音每天都经过这间教室，偏偏没有一句是来找我的。<br>
> 那么窄的楼道，我竟要把整个青春喊破，才觉得你肯回头。
<!-- /D05-5:output -->

### 现代文案，换个年代说

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
> 我想，就写到这里吧。再往下写，又都是舍不得你的话，翻来覆去，连我自己都快背下来了。我也想装得没那么在乎，想明天一醒来就有别的事忙，不用总在心里问你为什么。可现在还不行。现在只要想到以后不再找你，我就想把刚才那句话划掉。你不用回来劝我，我怕你语气稍微好一点，我又误会。就让我一个人把这几行写完，难看也好，反悔也好，今晚先不要让你知道。
<!-- /D06:output -->

<a id="installation"></a>

## 安装

这是给 Codex 使用的 Skill，不是一个独立聊天软件。不需要给这个仓库装 npm 依赖，也不需要在里面填写 API Key。

### 让 Codex 帮你装

把这段话发给 Codex：

```text
使用 $skill-installer，安装这个仓库根目录里的 youth-pain-literature Skill：
https://github.com/lemon-neko/youth-pain-literature
```

<details>
<summary>也可以手动安装（macOS / Linux / WSL）</summary>

需要已安装 Git。以下将仓库放进用户级 Skill 目录：

```bash
mkdir -p ~/.agents/skills
git clone https://github.com/lemon-neko/youth-pain-literature.git \
  ~/.agents/skills/youth-pain-literature
```

以后更新：

```bash
git -C ~/.agents/skills/youth-pain-literature pull --ff-only
```

如果已经安装过，请在原安装目录更新，不要再装一份同名 Skill。更新前保留好自己的改动；`--ff-only` 遇到分叉会停止，不会替你丢掉本地修改。

</details>

Codex 会自动发现新安装的 Skill；如果暂时没有出现，重启后再试。安装目录与发现机制见 [OpenAI 官方说明](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。

<a id="usage"></a>

## 怎么用

不用背参数，正常说话就行：

```text
使用 $youth-pain-literature
写 5 条毕业那年没表白的青春疼痛句子，像 2010 年贴吧。
别太成熟，也别每条都用“后来”开头。
```

想要更具体一点，就把你脑海里的画面交给它：

```text
使用 $youth-pain-literature
写一小段晚自习结束后，在车棚等喜欢的人。
2008 年，夏天，100～200 字。克制一点，不要写成多年后的总结。
```

也可以不讲故事，让心事自己说话：

```text
使用 $youth-pain-literature
写一段旧贴吧式分行抒情，主题是“我还不想跟你说晚安”。
不写校园，也不塞 QQ 物件。可以反复一句话，但每次心情要有一点变化。
```

<details>
<summary>想自己调参数，或者偷偷开一下抽象模式？</summary>

参数写法：

```text
使用 $youth-pain-literature
theme=初中喜欢的人
style=qzone
emotion=[secret-love,summer,graduation]
era=2008
length=paragraph
intensity=4
cringe=3
```

改写：

```text
使用 $youth-pain-literature
把“我偶尔会想起以前的朋友”改成 2010 年 QQ 空间日志，不要写得太成熟。
```

抽象二创，需要明确开启：

```text
使用 $youth-pain-literature
style=parody
主题：她删了我的 QQ
给我 3 条，前半认真，后半轻轻翻个车。
```

</details>

<a id="parameters"></a>

## 参数

不填也能写。最常用的是这两个旋钮：

- `intensity`：有多难过。`2` 是偶尔想起，`3` 是认真遗憾，`5` 是觉得整个青春都要跟着下雨。
- `cringe`：有多愿意承认自己矫情。`1` 比较克制，`5` 像那篇不敢让现在的朋友看到的空间日志。

两个都默认 `3`。不是开得越大越好，今天想写什么心情就调到哪里。

<details>
<summary>完整参数表与九种风格</summary>

| 参数 | 可选值 | 默认值 |
| --- | --- | --- |
| `style` | `tieba`、`qzone`、`signature`、<br>`campus-fiction`、`regret`、`internet-nostalgia`、<br>`hope-you-never-understand`、`pseudo-profound`、`parody` | `tieba` |
| `emotion` | 遗憾、失恋、暗恋、毕业、孤独、怀旧、友情、成长、离开、夏天、青春、深夜、下雨、重逢、没说出口等，可组合 | 按主题推断 |
| `era` | `2005`、`2008`、`2010`、`2012`、`2015`、`2020s-retro` | `2010` |
| `length` | `one-line`、`short`、`paragraph`、`post`、`story` | `short` |
| `intensity` | `1`～`5` | `3` |
| `cringe` | `1`～`5` | `3` |
| `huoxingwen` | `true` / `false` | `false` |
| `count` | 想要的条数 | `1` |

风格对照：贴吧短句 `tieba`、空间独白 `qzone`、个性签名 `signature`、校园故事 `campus-fiction`、青春遗憾 `regret`、旧网怀旧 `internet-nostalgia`、“希望你永远不懂” `hope-you-never-understand`、少年式伪深刻 `pseudo-profound`、抽象二创 `parody`。

`era` 也接受相近年份；`2020s-retro` 用来写今天回头看当年。长度从一句话到小故事，详见 [Skill 说明](SKILL.md)。

火星文只在 `huoxingwen=true` 时开启；`parody` 也需要明确请求。“抽象抒情”不等于“抽象搞笑”，不用担心写着写着突然变成段子。

</details>

## 小问题，先替你问了

**是不是只有校园和 QQ？**

不是。它保留校园小事，也能直接倾诉、分行抒情、串联意象。没有校服、头像、MP3，也可以写得很有那个年代的感觉。

**怎么感觉写得太像今天的文案？**

直接补一句“少讲道理，不要心理学套话，像当时正在发生”。也可以给一个动作、一句对白，或者说清楚你想对谁说话。

**会复制贴吧原句吗？**

项目的目标是原创表达，参考的是节奏和写法，不是换几个词复刻原句。不过生成内容仍可能与常见表达相似，公开使用前，值得自己再读一遍。

## 项目里装了什么

```text
.
├── SKILL.md              # 写作规则与入口
├── agents/openai.yaml    # Skill 展示信息
├── references/           # 九种风格、年代指南、42 组例子与来源笔记
├── prompts/              # 生成、改写、年代模仿、评价模板
├── tests/                # 行为测试、原始试跑记录与校验脚本
├── assets/               # README 封面与生成提示词
├── README.md
└── LICENSE
```

## 灵感与说明

这次回看的两扇旧窗户：

- 美文吧：[《我想用我的文字，和青春作伴》](https://tieba.baidu.com/p/3146320263)
- 长短句吧：[《你看南风吹，我等故人归》](https://tieba.baidu.com/p/4413356400)

只读到了部分楼主内容，没有读完整帖，也不把它们标成“句子吧精品”。我们借鉴分行、复沓和直接抒情的方式，不收录整帖原文；具体阅读范围放在[来源笔记](references/source-notes.md)。

封面是为本项目生成的 AI 插画，不是历史照片或 QQ 官方素材。[图片与生成提示词](assets/cover-prompt.md)一并留档。

<details>
<summary>想看验证和试跑记录，点这里</summary>

在仓库根目录运行（需要 Python 3，无第三方依赖）：

```bash
python3 tests/validate_project.py
```

脚本检查引用、参数、42 组示例与九类覆盖、试跑数量和长度、明显重复片段，以及 README 与保存记录的一致性。示例可以换排版，但不能悄悄改正文。字数不计空白和标点，句数是标点近似检查。

已有[十类行为测试](tests/cases.md)，每类两次试跑。[原始输入输出](tests/runs/2026-09-03.json)、[检查报告](tests/runs/2026-09-03-review.md)和[初版基线](tests/acceptance-output.md)都保留在仓库里。生成和自检来自同一对话助手，不是独立评测；官方 Skill 结构校验通过，也不代表文学质量或原创性得到了认证。

</details>

<a id="contributing"></a>

## 一起写

欢迎带着你的“这句不对味”来提 [Issue](https://github.com/lemon-neko/youth-pain-literature/issues)，也欢迎 PR。

最好附上提示词、参数、实际输出，以及你觉得哪里太现代、太工整或太像同一个模板。分享参考帖时留一个链接就好，不需要把整篇搬过来。聊天记录里的人名和联系方式，记得先藏好。

新增写法尽量兼顾校园叙事和抒情，保留默认关闭的火星文与抽象二创开关；改完跑一次校验。如果修改了写作规则，重新保存对应试跑，别把旧记录当成新结果。

## License

[MIT](LICENSE)。欢迎使用、修改和分享，分发时保留许可证声明。

---

写完记得保存。那年没保存的，已经够多了。
