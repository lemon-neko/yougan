# 从青春疼痛文学到有感

2026-10-13，项目从青春疼痛文学写作 Skill 升级为「有感 · yougan」，面向日常表达、文字创作与视觉创意。审美、创新与共情成为新的方法主线。

## 原版本仍然可读

历史标签：[`v1-youth-pain-literature`](https://github.com/lemon-neko/yougan/tree/v1-youth-pain-literature)。
固定提交：[`71059aa8c89a5b0ccc467c47f2eda013bb4f205d`](https://github.com/lemon-neko/yougan/tree/71059aa8c89a5b0ccc467c47f2eda013bb4f205d)。

- [原 Skill 与调用参数](https://github.com/lemon-neko/yougan/blob/v1-youth-pain-literature/SKILL.md)
- [42 组原创参考示例](https://github.com/lemon-neko/yougan/blob/v1-youth-pain-literature/references/examples.md)
- [2026-09-03 原始试跑](https://github.com/lemon-neko/yougan/blob/v1-youth-pain-literature/tests/runs/2026-09-03.json)
- [原 README、安装方法与封面](https://github.com/lemon-neko/yougan/blob/v1-youth-pain-literature/README.md)

这些资料保留在原始版本中，不改写记录，也不当作 yougan 的新测试结果。

## 调用与安装迁移

新版调用名为 `$yougan`。原有 `era`、`cringe` 等参数不是新版公共接口；怀旧可通过自然语言指定。新版也不再对全部创作禁止现代词汇，或要求作品保持青春疼痛语气。

已有安装者可以保留旧目录用于旧风格，另装新版；若只要新版，先保留本地修改，再将旧安装目录移出技能发现目录，按 [新版说明](README.md#安装使用) 安装，避免目录名与 Skill 名称不一致。仓库重定向不会自动改名本地目录或调用入口。

仅需要旧版时，可明确安装历史标签：

```bash
git clone --branch v1-youth-pain-literature --single-branch \
  https://github.com/lemon-neko/yougan.git ~/.agents/skills/youth-pain-literature
```

目标目录必须不存在；目录已有内容时不要覆盖。旧版固定在历史标签，不承诺继续获得新平台功能。

MIT 许可证和原作者 lemon-neko 署名保留。
