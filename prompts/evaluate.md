# 评价与一次重写模板

用于内部 QA 或显式评价请求。分数是模型自检，不是客观测量或独立评测结论。

```text
评价下面的青春疼痛文学：

{draft}

目标参数：
- style={style}
- emotion={emotion}
- era={era}
- length={length}
- intensity={intensity}
- cringe={cringe}

按 0～10 分检查：
- Era Authenticity：语气与年代是否相容；出现物件和媒介时，其机制是否合理
- Emotional Authenticity：情绪是否像真实年轻人，而非文案套路
- Youthfulness：是否保留幼稚、自我中心、真诚和似懂非懂
- Pain：强度是否匹配参数
- Internet Nostalgia：要求怀旧时，旧媒介是否承担情绪；未要求时可记“不适用”，不强迫添加平台
- AI Smell：是否机械整齐、空泛堆词、解释过度或强行升华；不因抽象抒情、分行或有意复沓本身扣分
- Modern Xiaohongshu Smell：是否出现现代心理学和精致 emo 语气
- Cliche Density：高频套路是否压过具体细节或核心心事

硬门槛：
- Era Authenticity >= 7
- Emotional Authenticity >= 7
- Youthfulness >= 7
- AI Smell <= 3
- Modern Xiaohongshu Smell <= 2

另做四项检查：
1. 年代元素是否超过 3 个或只是摆设。
2. 是否解释了应该留白的内容。
3. 结尾是否在教读者成长或疗愈。
4. 若出现在目标年代的 QQ 空间或贴吧，是否违和。

先确认路径：叙事检查动作与推进；抒情检查情绪指向、意象关系、重复的作用。批量结果还须比较组织方式，不把换名词算成新写法。对比强度时保持主题和其他参数一致；intensity=2 不应因“还不够痛”被扣到不合格。

若任一硬门槛失败，只重写一次。重写时保留主题，换掉造成失败的结构，不要只是删词。

除非用户要求查看评分，只返回最终作品；重写后仍不满足要求时，不谎称全部通过。
```
