#!/usr/bin/env python3
"""Deterministic repository checks; not a judge of style or originality."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
RUN_PATH = ROOT / "tests/runs/2026-09-03.json"
STYLES = ["tieba", "qzone", "signature", "campus-fiction", "regret",
          "internet-nostalgia", "hope-you-never-understand", "pseudo-profound", "parody"]
EMOTIONS = ["regret", "breakup", "secret-love", "graduation", "loneliness",
            "nostalgia", "friendship", "growth", "departure", "summer", "youth",
            "midnight", "rain", "reunion", "unspoken"]
ERAS = ["2005", "2008", "2010", "2012", "2015", "2020s-retro"]
LENGTHS = ["one-line", "short", "paragraph", "post", "story"]
MODERN = ["情绪价值", "内耗", "松弛感", "精神内核", "自洽", "允许一切发生",
          "接住自己", "接住自己的情绪", "与自己和解", "成为更好的自己", "人生旷野",
          "爱自己", "情绪稳定", "课题分离", "关系中的边界感", "低配得感",
          "高敏感", "停止期待", "筛选关系", "接纳自己"]
HUOXINGWEN = "伱莪噯囙憶"


def bundle_hash():
    """Hash instructions only, with relative paths and NUL separators."""
    paths = [ROOT / "SKILL.md", *ROOT.glob("references/*.md"), *ROOT.glob("prompts/*.md")]
    digest = hashlib.sha256()
    for path in sorted(paths, key=lambda p: p.relative_to(ROOT).as_posix()):
        digest.update(path.relative_to(ROOT).as_posix().encode())
        digest.update(b"\0")
        digest.update(path.read_bytes())
        digest.update(b"\0")
    return digest.hexdigest()


def normalized(text):
    # Han characters, letters and digits count; punctuation/whitespace do not.
    return "".join(char for char in text if char.isalnum())


def render_prompt(record):
    return record["prompt"] + "\n\n" + "\n".join(
        f"{key}={json.dumps(value, ensure_ascii=False, separators=(',', ':')) if isinstance(value, (list, bool)) else value}"
        for key, value in record["params"].items()
    )


def render_output(record):
    outputs = record["outputs"]
    if len(outputs) == 1:
        return outputs[0]
    return "\n\n".join(f"{i}. {value}" for i, value in enumerate(outputs, 1))


def render_readme_output(record):
    """Wrap prose without altering saved text; explicit breaks preserve short lines."""
    lines = render_output(record).split("\n")
    return "\n".join(
        "> " + line + ("<br>" if line and i + 1 < len(lines) and lines[i + 1] else "")
        if line else ">"
        for i, line in enumerate(lines)
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fingerprint", action="store_true", help="Print current instruction hash only")
    args = parser.parse_args()
    if args.fingerprint:
        print(bundle_hash())
        return 0

    errors, warnings = [], []

    def check(condition, message):
        if not condition:
            errors.append(message)

    skill = (ROOT / "SKILL.md").read_text()
    readme = (ROOT / "README.md").read_text()
    examples = (ROOT / "references/examples.md").read_text()
    check(re.findall(r"^### (\d+)｜", examples, re.M) == [f"{i:02}" for i in range(1, 43)],
          "Few-shot IDs must be exactly 01..42")
    categories = re.findall(r"^## (.+)$", examples, re.M)
    check(categories == ["贴吧句子吧", "QQ 空间日志", "非主流个性签名", "青春疼痛小说",
                         "青春遗憾", "时代互联网怀旧", "希望你永远不懂", "伪深刻文学",
                         "青春疼痛 × 抽象", "使用提示"], "Few-shot category coverage changed")
    style_guide = (ROOT / "references/styles.md").read_text()
    check(re.findall(r"^## STYLE \d+.*?`([^`]+)`", style_guide, re.M) == STYLES,
          "Style guide must retain all nine styles")
    for key, expected in [("style", STYLES), ("emotion", EMOTIONS), ("era", ERAS), ("length", LENGTHS)]:
        line = next(line for line in skill.splitlines() if line.startswith(f"- `{key}`："))
        check(re.findall(r"`([^`]+)`", line)[1:] == expected, f"SKILL {key} interface changed")
    for key, expected in [("style", STYLES), ("era", ERAS), ("length", LENGTHS)]:
        line = next(line for line in readme.splitlines() if line.startswith(f"| `{key}` |"))
        check(re.findall(r"`([^`]+)`", line.split("|")[2]) == expected,
              f"README {key} differs from SKILL")
    for fragment in ["`huoxingwen=true|false`：默认 `false`", "`style=tieba`、`era=2010`、`length=short`",
                     "`intensity=1-5`：情绪强度；默认 `3`", "`cringe=1-5`：年代羞耻指数；默认 `3`",
                     "“抽象抒情”不触发它", "`huoxingwen=true` 也必须显式开启"]:
        check(fragment in skill, f"Default/switch guard missing: {fragment}")
    for fragment in ["Era Authenticity >= 7", "Emotional Authenticity >= 7", "Youthfulness >= 7",
                     "AI Smell <= 3", "Modern Xiaohongshu Smell <= 2"]:
        check(fragment in skill and fragment in (ROOT / "prompts/evaluate.md").read_text(),
              f"Quality threshold mismatch: {fragment}")

    for path in ROOT.rglob("*.md"):
        if ".git" in path.parts:
            continue
        for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", path.read_text()):
            if "://" in target or target.startswith(("#", "mailto:")):
                continue
            target = target.split("#", 1)[0]
            check((path.parent / target).exists(), f"Broken relative link: {path.relative_to(ROOT)} -> {target}")

    data = json.loads(RUN_PATH.read_text())
    check(data["meta"]["independent_evaluation"] is False, "Do not label this independent evaluation")
    check(data["meta"]["skill_sha256"] == bundle_hash(), "Instruction snapshot changed since generation")
    demo_ids = ["D01", "D02", "D03", "D04", "D05-2", "D05-3", "D05-5", "D06"]
    check([row["id"] for row in data["demos"]] == demo_ids, "Demo coverage mismatch")
    check([row["id"] for row in data["cases"]] == [f"C{i:02}" for i in range(1, 11)],
          "Regression coverage must be C01..C10")
    intensity_rows = [row for row in data["demos"] if row["id"].startswith("D05-")]
    check(len({row["prompt"] for row in intensity_rows}) == 1, "Intensity prompts differ")
    fixed_params = [{key: value for key, value in row["params"].items() if key != "intensity"}
                    for row in intensity_rows]
    check(all(value == fixed_params[0] for value in fixed_params), "Intensity comparison confounds parameters")
    check([row["params"]["intensity"] for row in intensity_rows] == [2, 3, 5], "Intensity levels mismatch")
    for row in data["demos"]:
        for kind, expected in [("prompt", render_prompt(row)), ("output", render_output(row))]:
            pattern = rf"<!-- {row['id']}:{kind} -->\n(.*?)\n<!-- /{row['id']}:{kind} -->"
            matches = re.findall(pattern, readme, re.S)
            allowed = [f"```text\n{expected}\n```"]
            if kind == "output":
                allowed.append(render_readme_output(row))
            check(len(matches) == 1 and matches[0] in allowed,
                  f"README {row['id']} {kind} not an exact copy")

    case_text = (ROOT / "tests/cases.md").read_text()
    case_sections = re.split(r"^## Case \d+｜.*$", case_text, flags=re.M)[1:]
    for row, section in zip(data["cases"], case_sections):
        blocks = re.findall(r"```text\n(.*?)\n```", section, re.S)
        expected = blocks[0] if row["id"] != "C07" else f"输入：{blocks[0]}\n请求：{blocks[1]}"
        check(row["prompt"] == expected, f"{row['id']} recorded prompt differs from cases.md")
        check([run["id"] for run in row["runs"]] == ["A", "B"], f"{row['id']} needs two runs")

    samples = []
    constraints = {"D02": (100, 180), "D04": (100, 200), "D06": (100, 200),
                   "C01": (100, 300), "C04": (150, 250), "C07": (100, 200), "C08": (100, 180)}
    for row in data["demos"] + data["cases"]:
        params = row["params"]
        check(params["style"] in STYLES, f"Invalid style: {row['id']}")
        check(params["length"] in LENGTHS, f"Invalid length: {row['id']}")
        check(all(value in EMOTIONS for value in params["emotion"]), f"Invalid emotion: {row['id']}")
        check(params["era"] in ERAS or (params["era"].isdigit() and 2004 <= int(params["era"]) <= 2016),
              f"Unsupported era: {row['id']}")
        check(all(isinstance(params[key], int) and 1 <= params[key] <= 5 for key in ["intensity", "cringe"]),
              f"Invalid intensity/cringe: {row['id']}")
        check(params["style"] != "parody" or "style=parody" in row["prompt"],
              f"Parody activated without request: {row['id']}")
        # Check literal key=value inputs against saved resolved parameters.
        for key, literal in re.findall(r"^(style|era|length|intensity|cringe|count|emotion)=(.+)$", row["prompt"], re.M):
            value = literal.strip()
            if key in ["intensity", "cringe", "count"]:
                value = int(value)
            elif key == "emotion":
                value = value.strip("[]").split(",")
            check(params[key] == value, f"Resolved parameter mismatch: {row['id']} {key}")
        runs = row.get("runs", [{"id": "demo", "outputs": row.get("outputs", [])}])
        for run in runs:
            tag = f"{row['id']}-{run['id']}"
            check(len(run["outputs"]) == params["count"], f"Wrong output count: {tag}")
            sizes = []
            for i, output in enumerate(run["outputs"], 1):
                name = f"{tag}-{i}"
                sizes.append(len(normalized(output)))
                check(not any(term in output for term in MODERN), f"Modern phrase: {name}")
                if not params.get("huoxingwen", False):
                    check(not any(char in output for char in HUOXINGWEN), f"Unexpected huoxingwen: {name}")
                if params["era"] != "2020s-retro" and int(params["era"]) <= 2010:
                    check(not any(term in output for term in ["已读", "朋友圈", "短视频", "抖音", "小红书"]),
                          f"Possible era error: {name}")
                sentences = len(re.findall(r"[。！？]+", output))
                # A trailing ellipsis can close a signature; internal pauses do not.
                if output.rstrip().endswith("……"):
                    sentences += 1
                if params["length"] == "one-line":
                    check(sentences == 1 and "\n" not in output, f"Expected one sentence: {name}")
                    check(10 <= sizes[-1] <= 30, f"Signature length {sizes[-1]}: {name}")
                elif params["length"] == "short":
                    check(2 <= sentences <= 5, f"Expected 2..5 sentences: {name} got {sentences}")
                bounds = constraints.get(row["id"])
                if bounds:
                    check(bounds[0] <= sizes[-1] <= bounds[1], f"Length {sizes[-1]} outside {bounds}: {name}")
                if row["id"] == "C08":
                    check(not any(term in output for term in ["校园", "教室", "课桌", "校服", "同桌", "QQ", "手机"]),
                          f"Excluded prop in C08: {name}")
                    check(output.count("\n") >= 3, f"Missing lyrical line breaks: {name}")
                if row["id"] == "C09":
                    check(output.count("再等一会儿") >= 2, f"Missing intentional refrain: {name}")
                samples.append((name, normalized(output)))
            print(f"{tag}: {len(run['outputs'])} outputs, character counts {sizes}")

    # Conservative review flags only: shared 12-character strings are not proof of plagiarism.
    reference_blocks = []
    for path in [*ROOT.glob("references/*.md"), ROOT / "tests/acceptance-output.md"]:
        reference_blocks.extend((str(path.relative_to(ROOT)), normalized(block))
                                for block in re.split(r"\n\s*\n", path.read_text()))
    for i, (name, body) in enumerate(samples):
        check(all(body != previous for _, previous in samples[:i]), f"Exact duplicate output: {name}")
        grams = {body[j:j + 12] for j in range(max(0, len(body) - 11))}
        for other_name, other_body in samples[:i] + reference_blocks:
            overlap = sorted(gram for gram in grams if gram in other_body)
            if overlap:
                warnings.append(f"Review overlap {name} / {other_name}: {overlap[0]}")
    print(f"Checked {len(samples)} outputs; 42 few-shots; 9 styles; 20 regression runs; 8 demo records.")
    for warning in warnings:
        print("REVIEW: " + warning)
    for error in errors:
        print("FAIL: " + error, file=sys.stderr)
    print(f"Result: {len(errors)} errors, {len(warnings)} overlap flags. Human style review is still required.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
