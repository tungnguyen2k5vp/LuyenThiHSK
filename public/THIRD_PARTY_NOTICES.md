## no7z reconstruction activities (22 October 2026 continuation)

Added 4,349 dictation and 4,331 sentence reconstruction exercises derived from the previously imported no7z/Jayoung sentence dataset at commit 857dfbab91027ebd97df01260e91b817cb6b4854. These adaptations remain CC BY-SA 4.0 with the existing no7z/CC-CEDICT attribution. Existing normal/slow CosyVoice2 recordings are reused; no new recordings or official exam assets are claimed. Reconstruction keys are source-derived, not independently reviewed. See /data/open-hsk/NO7Z_ATTRIBUTION.md and /data/open-hsk/LICENSES.md.

# HSK curriculum data notices

## Mandarin Zone HSK 4 practice adaptation (22 October 2026)

Source: Mandarin Zone (https://mandarinzone.com), distributed in https://github.com/Make-dream-clear/hsk4-mock-exam at commit 44a0832adc327500b4cc1d6f2dfc6ee90bbe4e92. License: CC BY-NC-SA 4.0, https://creativecommons.org/licenses/by-nc-sa/4.0/ . Adapted files under `/data/mandarin-zone/` retain this license: attribution, non-commercial use and share-alike apply. This does not relicense the application source code.

Changes: select the first 12 community sets; omit unsupported/incomplete questions and official-marked sets; normalize IDs, schemas and option labels; retain source keys/explanations; map audio to an on-demand local cache. 1,033 questions included; 142 omitted. Keys are not independently reviewed; some explanations are English. Hashes, sources and omissions: `/data/mandarin-zone/manifest.json`. License text: `/data/mandarin-zone/LICENSE.txt`.

The released dictionary adaptation in public/data is licensed CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/ . Changes: normalized fields, edition/level/source-page mapping, dictionary joins by Hanzi and pronunciation, filtering and level shards. This license applies to the adapted data, not automatically to the application source code.

- CVDICT, Phong Phan: https://github.com/ph0ngp/CVDICT . CC BY-SA 4.0. Based on CC-CEDICT, including contributions by Paul Andrew Denisowski and the CC-CEDICT community: https://www.mdbg.net/chinese/dictionary?page=cc-cedict . CVDICT includes machine-assisted Vietnamese translation and may contain errors. No blanket claim of linguistic verification is made.
- Complete HSK Vocabulary, copyright (c) 2026 Yanis Zafirópulos: https://github.com/drkameleon/complete-hsk-vocabulary . MIT repository; imported English dictionary definitions retain CC-CEDICT CC BY-SA 4.0 terms. Frequency, radical and external part-of-speech analyses from this repository are not imported.
- CTI syllabus: https://www.chinesetest.cn/syllabus . Word/reading/level facts and short structure/category identifiers are reconciled against the 2025 syllabus PDF. The official PDF, sample questions, passages, answer keys, recordings and example sentences are not redistributed in this release. Dictionary definitions are not official CTI translations.
- Stroke paths: hanzi-writer-data 2.0.1, derived from Make Me a Hanzi. https://github.com/chanind/hanzi-writer-data . Copyright Arphic Technology Co., Ltd.; Arphic Public License. Full license: /ARPHICPL.TXT . Paths are split by character; no simplified glyph is substituted for a different traditional character.

## MIT notice for Complete HSK Vocabulary

Copyright (c) 2026 Yanis Zafirópulos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Open HSK datasets (22 October 2026)

no7z / Jayoung: https://github.com/no7z/hsk-sentences-audio at commit 857dfbab91027ebd97df01260e91b817cb6b4854. Sentence data, synthesized normal/slow recordings and our derived exercises under /data/open-hsk/no7z-* are CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/ . Adaptations: canonicalize duplicate sentences, normalize fields/IDs, preserve alternate recordings, create MC choices and split practice banks. Audio synthesized with CosyVoice2-0.5B, not human exam recordings. Full upstream credits, CC-CEDICT obligations and engine references retained at /data/open-hsk/NO7Z_ATTRIBUTION.md. Upstream code MIT license is separate at /data/open-hsk/NO7Z_CODE_LICENSE.txt.

HearMandarin: https://hearmandarin.com/datasets/ ; word dataset version 2026-09-09, generated 2026-09-28. CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ . Adaptations: merge duplicate Hanzi/pronunciation records, preserve source variants and edition bands, join licensed gloss/POS to existing word IDs, generate advanced vocabulary exercises. No HearMandarin site audio/readers/tests included.

Per-record provenance is retained in sentences.json, words.json and bank JSON; shared summary at /data/open-hsk/LICENSES.md. These licenses apply to their respective data adaptations and do not relicense application source. Existing Mandarin Zone noncommercial restrictions still apply to that collection.
