"""Draft transcription helper; no human pronunciation review is implied."""
import json
import pathlib
import sys
sys.path.insert(0, str(pathlib.Path('.runtime/tts/python').resolve()))
from pypinyin import lazy_pinyin, Style
texts = json.load(sys.stdin)
result = {}
for text in texts:
    syllables = lazy_pinyin(text, style=Style.TONE, errors=lambda x: list(x))
    value = ' '.join(syllables)
    for mark in '。，？！、；：':
        value = value.replace(' ' + mark, mark)
    result[text] = value
json.dump(result, sys.stdout, ensure_ascii=True)
