# youth-pain-literature

一个专门生成「中文互联网青春疼痛文学」的 Codex Skill。

它想找回的不是今天精致、治愈、讲究情绪价值的 emo 文案，而是 2005～2015 年前后那种会被复制进 QQ 个性签名、空间日志、贴吧句子楼和同学录里的表达：有年代感，有点笨拙，真诚得过分，也矫情得刚刚好。

> 青春期的人第一次遇到普通的离开，却觉得这是世界上从未发生过的大事。

## 能做什么

- 从零生成句子吧短句、QQ 签名、空间日志和校园疼痛故事
- 按 2005、2008、2010、2012、2015 或 `2020s-retro` 控制年代
- 处理遗憾、失恋、暗恋、毕业、友情、成长、雨天、夏天等复合情绪
- 将普通句子或现代小红书文案改写成旧互联网语感
- 一次生成多个真正不同的版本
- 可选轻度火星文和“青春疼痛 × 抽象”二创模式

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
│   └── examples.md
├── prompts/
│   ├── generate.md
│   ├── rewrite.md
│   ├── imitate-era.md
│   └── evaluate.md
└── tests/
    ├── cases.md
    └── acceptance-output.md
```

## 原创与版权

仓库中的 few-shot 示例均为本项目原创，不收录真实贴吧长帖、小说原文、歌词或大规模网络语料。Skill 学习的是句法、节奏、意象、媒介和情绪结构，而不是复刻具体作品。

一句话验收标准：

> 这句话如果出现在 2010 年的 QQ 空间，我会觉得违和吗？

如果答案是“会”，就还不够像。

## License

[MIT](LICENSE)
