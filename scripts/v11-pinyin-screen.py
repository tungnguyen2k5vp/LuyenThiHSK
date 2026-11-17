"""Local dictionary comparison only; never a human pronunciation approval."""
import json, re, sys, unicodedata
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, str(Path('.runtime/tts/python').resolve()))
from pypinyin import lazy_pinyin, Style

data = json.loads(Path('data/staging/v11/content.json').read_text(encoding='utf-8'))
def norm(s):
    return ''.join(c.lower() for c in unicodedata.normalize('NFC', s) if c.isalpha())
rows = []
for item in data['lessons'] + data['wordDrafts']:
    for ex in item.get('examples', []):
        expected = ''.join(lazy_pinyin(ex['zh'], style=Style.TONE, tone_sandhi=True, errors='ignore'))
        def base(s):
            return ''.join(c for c in unicodedata.normalize('NFD', norm(s)) if not unicodedata.combining(c))
        same = norm(expected) == norm(ex['pinyin'])
        category = 'MATCH' if same else ('TONE_NEUTRAL_OR_SANDHI_DIFFERENCE' if base(expected) == base(ex['pinyin']) else 'ERHUA_SEGMENTATION' if '儿' in ex['zh'] else 'BASE_PINYIN_DIFFERENCE')
        rows.append({'id': item['id'], 'zh': ex['zh'], 'authored': ex['pinyin'], 'dictionary': expected,
                     'status': 'MATCH' if same else 'DICTIONARY_DIFFERENCE_NEEDS_REVIEW', 'category': category,
                     'decision': 'KEEP_DRAFT_NO_HUMAN_APPROVAL', 'note': 'Dictionary/citation/neutral-tone/sandhi conventions can differ; do not replace authored pinyin mechanically.'})
report = {'method': 'Local pypinyin 0.55 dictionary + tone_sandhi, whitespace/punctuation/case ignored; not phonetic/human certification',
          'checked': len(rows), 'matches': sum(r['status'] == 'MATCH' for r in rows), 'rows': rows, 'humanReviewed': 0}
Path('data/reports/v11/pinyin-screen.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'checked': len(rows), 'matches': report['matches'], 'differences': [r for r in rows if r['status'] != 'MATCH']}, ensure_ascii=False))
