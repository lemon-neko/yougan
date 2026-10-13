"""Regression tests for evidence drift and unsafe/malformed validation inputs."""
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from validate_project import ROOT, fingerprint, validate


class ValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'yougan'
        shutil.copytree(ROOT, self.root, ignore=shutil.ignore_patterns('.git', '__pycache__', '.venv'))

    def edit_run(self, change):
        path = self.root / 'tests/runs/2026-10-13.json'
        data = json.loads(path.read_text())
        change(data)
        path.write_text(json.dumps(data, ensure_ascii=False))

    def test_current_project_is_consistent(self):
        self.assertEqual(validate(self.root), [])

    def test_instruction_change_invalidates_record(self):
        with (self.root / 'prompts/refine.md').open('a') as f:
            f.write('\n不同的指令\n')
        self.assertNotEqual(fingerprint(self.root), fingerprint(ROOT))
        self.assertTrue(any('snapshot changed' in e for e in validate(self.root)))

    def test_published_example_drift_is_detected(self):
        path = self.root / 'README.md'
        path.write_text(path.read_text().replace('饭还是盛了满满一碗。', '另一句话。'))
        self.assertTrue(any('demo drift' in e or 'Quick example drift' in e for e in validate(self.root)))

    def test_missing_resource_is_reported(self):
        (self.root / 'assets/yougan-cover.png').unlink()
        self.assertTrue(any('Broken link' in e for e in validate(self.root)))

    def test_run_pointer_cannot_escape_runs(self):
        (self.root / 'tests/current-run.txt').write_text('../../outside.json')
        self.assertIn('Unsafe current-run pointer', validate(self.root))

    def test_wrong_output_count_is_detected(self):
        self.edit_run(lambda d: d['cases'][2]['runs'][0]['outputs'].pop())
        self.assertTrue(any('output count mismatch' in e for e in validate(self.root)))

    def test_overlapping_storyboard_times_are_rejected(self):
        def change(data):
            outputs = data['cases'][5]['runs'][0]['outputs']
            outputs[1] = outputs[1].replace('4–8 秒', '3–8 秒')
        self.edit_run(change)
        self.assertTrue(any('shot continuity' in e for e in validate(self.root)))

    def test_invalid_json_is_reported(self):
        (self.root / 'tests/examples.json').write_text('{broken')
        self.assertTrue(any('Invalid JSON' in e for e in validate(self.root)))


if __name__ == '__main__':
    unittest.main()
