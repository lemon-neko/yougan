# 评价与一次重写模板

用于内部 QA 或显式评价请求。

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
- Era Authenticity：年代物件和媒介机制是否合理
- Emotional Authenticity：情绪是否像真实年轻人，而非文案套路
- Youthfulness：是否保留幼稚、自我中心、真诚和似懂非懂
- Pain：强度是否匹配参数
- Internet Nostalgia：旧互联网元素是否真正参与情节
- AI Smell：是否工整、抽象、解释过度、强行升华
- Modern Xiaohongshu Smell：是否出现现代心理学和精致 emo 语气
- Cliche Density：高频套路是否压过具体细节

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

若任一硬门槛失败，只重写一次。重写时保留主题，换掉造成失败的结构，不要只是删词。

除非用户要求查看评分，只返回通过门槛的最终版本。
```
