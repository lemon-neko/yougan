#!/usr/bin/env python3
"""Validate reproducible content and objective constraints, not aesthetic quality."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
TASKS = {'observe', 'ideate', 'create', 'refine', 'review'}


def instruction_files(root):
    paths = [root / 'SKILL.md', root / 'agents/openai.yaml',
             *root.glob('references/*.md'), *root.glob('prompts/*.md')]
    return sorted(paths, key=lambda p: p.relative_to(root).as_posix())


def fingerprint(root=ROOT):
    digest = hashlib.sha256()
    files = {}
    for path in instruction_files(root):
        name = path.relative_to(root).as_posix()
        content = path.read_bytes()
        digest.update(name.encode('utf-8') + b'\0' + content + b'\0')
        files[name] = hashlib.sha256(content).hexdigest()
    return digest.hexdigest(), files


def quote_output(output):
    lines = output.splitlines()
    return '\n'.join('> ' + line + ('<br>' if line and i + 1 < len(lines) and lines[i + 1] else '')
                     if line else '>' for i, line in enumerate(lines))


def slug(text):
    text = text.replace('`', '').lower()
    return ''.join(c for c in text if c.isalnum() or c in ' _-').replace(' ', '-')


def validate(root=ROOT):
    root = Path(root).resolve()
    errors = []

    def check(condition, message):
        if not condition:
            errors.append(message)

    def read(path):
        try:
            return (root / path).read_text(encoding='utf-8')
        except (OSError, UnicodeError) as exc:
            errors.append(f'Cannot read {path}: {exc}')
            return ''

    def load_json(path):
        try:
            result = json.loads(read(path))
            if not isinstance(result, dict):
                raise ValueError('expected a JSON object')
            return result
        except (ValueError, TypeError) as exc:
            errors.append(f'Invalid JSON {path}: {exc}')
            return {}

    skill, readme, ui = read('SKILL.md'), read('README.md'), read('agents/openai.yaml')
    check(bool(re.search(r'^name: yougan$', skill, re.M)), 'Skill name must be yougan')
    check('$yougan' in ui and '有感' in ui, 'UI metadata and invocation must use yougan')
    description = re.search(r'^  short_description: "([^"]+)"$', ui, re.M)
    check(description is not None and 25 <= len(description[1]) <= 64, 'UI short description must have 25..64 characters')
    for task in TASKS:
        check((root / f'prompts/{task}.md').is_file(), f'Missing prompt: {task}')
        check(f'task={task}' in read(f'prompts/{task}.md'), f'Prompt task mismatch: {task}')
    for name in ['aesthetics', 'innovation', 'empathy', 'visual', 'examples']:
        check((root / f'references/{name}.md').is_file(), f'Missing guide: {name}')
    for name in ['HISTORY.md', 'CONTRIBUTING.md', 'LICENSE', '.github/workflows/validate.yml',
                 '.github/ISSUE_TEMPLATE/case.md', '.github/ISSUE_TEMPLATE/rewrite.md',
                 '.github/ISSUE_TEMPLATE/feedback.md', 'assets/yougan-cover.png', 'assets/cover-prompt.md']:
        check((root / name).is_file(), f'Missing resource: {name}')
    check('Copyright (c) 2026 lemon-neko' in read('LICENSE'), 'Original attribution missing')
    check('71059aa8c89a5b0ccc467c47f2eda013bb4f205d' in read('HISTORY.md'), 'Historical commit missing')

    # Check actual relative Markdown resources and heading anchors, excluding fenced code.
    for path in sorted(root.rglob('*.md')):
        if any(part in {'.git', '.venv', 'node_modules'} for part in path.relative_to(root).parts):
            continue
        content = re.sub(r'^```.*?^```\s*$', '', path.read_text(encoding='utf-8'), flags=re.M | re.S)
        for target in re.findall(r'!?\[[^\]]*\]\(([^)]+)\)', content):
            url = urlsplit(target)
            if url.scheme or url.netloc:
                continue
            resolved = (path.parent / unquote(url.path)).resolve() if url.path else path
            if not resolved.is_relative_to(root):
                errors.append(f'Link escapes project: {path.relative_to(root)} -> {target}')
                continue
            if not resolved.exists():
                errors.append(f'Broken link: {path.relative_to(root)} -> {target}')
                continue
            if url.fragment and resolved.suffix == '.md':
                headings = re.findall(r'^#{1,6}\s+(.+)$', resolved.read_text(encoding='utf-8'), re.M)
                check(unquote(url.fragment) in {slug(h) for h in headings}, f'Broken anchor: {target}')

    examples = load_json('tests/examples.json')
    check(examples.get('kind') == 'editorial_examples', 'Examples must disclose editorial status')
    demos = examples.get('demos', [])
    check(isinstance(demos, list) and len(demos) == 6, 'Need six editorial examples')
    if not isinstance(demos, list):
        demos = []
    check({d.get('theme') for d in demos if isinstance(d, dict)} ==
          {'joy', 'friendship', 'loneliness', 'nostalgia', 'everyday', 'imagination'}, 'Example theme coverage incomplete')
    check(len({d.get('id') for d in demos if isinstance(d, dict)}) == len(demos), 'Duplicate demo IDs')
    examples_md = read('references/examples.md')
    for demo in demos:
        if not isinstance(demo, dict) or not all(isinstance(demo.get(k), str) for k in ['id', 'prompt', 'output']):
            errors.append('Malformed demo')
            continue
        for key in ['prompt', 'output']:
            expected = f"```text\n{demo[key]}\n```" if key == 'prompt' else quote_output(demo[key])
            pattern = rf"<!-- {re.escape(demo['id'])}:{key} -->\n(.*?)\n<!-- /{re.escape(demo['id'])}:{key} -->"
            matches = re.findall(pattern, readme, re.S)
            check(matches == [expected], f"README demo drift: {demo['id']} {key}")
        canonical = f"```text\n{demo['prompt']}\n```\n\n### 输出\n\n{demo['output']}\n"
        check(canonical in examples_md, f"Examples guide drift: {demo['id']}")
    if demos and isinstance(demos[0], dict) and isinstance(demos[0].get('output'), str):
        quick = re.findall(r'<!-- D01:quick-output -->\n(.*?)\n<!-- /D01:quick-output -->', readme, re.S)
        check(quick == [quote_output(demos[0]['output'])], 'Quick example drift')

    cases = load_json('tests/cases.json').get('cases', [])
    if not isinstance(cases, list) or not all(isinstance(c, dict) for c in cases):
        errors.append('Malformed case definitions')
        return errors
    check(len(cases) == 10, 'Need ten behavioral cases')
    check({c.get('task') for c in cases} == TASKS and all(sum(c.get('task') == t for c in cases) == 2 for t in TASKS),
          'Need two cases per capability')
    ids = [c.get('id') for c in cases]
    check(len(set(ids)) == len(ids), 'Duplicate case IDs')
    pointer = read('tests/current-run.txt').strip()
    run_path = (root / 'tests' / pointer).resolve()
    if not pointer or not run_path.is_relative_to(root / 'tests/runs') or run_path.suffix != '.json':
        errors.append('Unsafe current-run pointer')
        return errors
    data = load_json(run_path.relative_to(root))
    meta = data.get('meta', {})
    if not isinstance(meta, dict):
        errors.append('Malformed run metadata')
        return errors
    check(meta.get('independent_evaluation') is False and bool(meta.get('method')), 'Trial provenance missing')
    digest, files = fingerprint(root)
    check(meta.get('instruction_sha256') == digest and meta.get('instruction_files') == files,
          'Instruction snapshot changed: regenerate relevant trials, not just the hash')
    records = data.get('cases', [])
    if not isinstance(records, list) or not all(isinstance(c, dict) for c in records):
        errors.append('Malformed trial cases')
        return errors
    check([c.get('id') for c in records] == ids, 'Trial coverage/order mismatch')
    seen = set()
    for case, record in zip(cases, records):
        cid = str(case.get('id'))
        check(record.get('task') == case.get('task') and record.get('prompt') == case.get('prompt'), f'{cid}: input mismatch')
        trials = record.get('runs', [])
        if not isinstance(trials, list) or not all(isinstance(t, dict) for t in trials):
            errors.append(f'{cid}: malformed trials')
            continue
        check([t.get('id') for t in trials] == ['A', 'B'], f'{cid}: need A and B trials')
        checks = case.get('checks', {})
        for trial in trials:
            outputs = trial.get('outputs', [])
            if not isinstance(outputs, list) or not all(isinstance(o, str) and o.strip() for o in outputs):
                errors.append(f'{cid}: malformed outputs')
                continue
            tag = f"{cid}-{trial.get('id')}"
            check(bool(trial.get('review')), f'{tag}: manual review missing')
            check(len(outputs) == checks.get('output_count'), f'{tag}: output count mismatch')
            text = '\n'.join(outputs)
            check(text not in seen, f'{tag}: exact duplicate trial')
            seen.add(text)
            for term in checks.get('required', []):
                check(term in text, f'{tag}: required text missing: {term}')
            for term in checks.get('forbidden', []):
                check(term not in text, f'{tag}: prohibited text: {term}')
            if 'line_count' in checks:
                check(len(text.splitlines()) == checks['line_count'], f'{tag}: line count mismatch')
            if 'duration_seconds' in checks:
                intervals = re.findall(r'(\d+)[–-](\d+) 秒', text)
                numbers = [(int(start), int(end)) for start, end in intervals]
                contiguous = bool(numbers) and numbers[0][0] == 0 and all(end > start for start, end in numbers)
                contiguous = contiguous and all(a[1] == b[0] for a, b in zip(numbers, numbers[1:]))
                check(contiguous and len(numbers) == len(outputs) and numbers[-1][1] == checks['duration_seconds'],
                      f'{tag}: duration or shot continuity mismatch')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--fingerprint', action='store_true')
    args = parser.parse_args()
    if args.fingerprint:
        print(json.dumps(dict(zip(['instruction_sha256', 'instruction_files'], fingerprint())), ensure_ascii=False, indent=2))
        return 0
    try:
        errors = validate()
    except (OSError, ValueError, TypeError, KeyError) as exc:
        errors = [f'Malformed project data: {exc}']
    for error in errors:
        print('FAIL: ' + error, file=sys.stderr)
    print(f'{len(errors)} errors; checked 6 editorial examples and 20 recorded behavioral trials.')
    print('Structural validation only. Aesthetic quality, empathy and originality require human review.')
    return int(bool(errors))


if __name__ == '__main__':
    sys.exit(main())
