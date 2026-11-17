# 4Chinese learning library

The web learning area reuses the local 4Chinese 0.1.57 canonical dictionary merge, explicit meaning corrections, topic classification, SRS scheduler, statistics helpers and community RPC contracts. The source app at `HocTiengTrungApp` is not modified. File-level source hashes are recorded in `reused-source.json`.

- complete-hsk-vocabulary, Yanis Zafirópulos, MIT: https://github.com/drkameleon/complete-hsk-vocabulary
- CVDICT, Phong Phan, CC BY-SA 4.0: https://github.com/ph0ngp/CVDICT. Derived Vietnamese meanings retain CC BY-SA 4.0; machine translations are labelled.
- Starter examples and explicit corrections: project-authored 4Chinese content.
- HSK November 2025 syllabus membership is matched by headword, full reading and compatible part of speech using the app's matcher. Unresolved rows are not assigned a made-up level. The source dictionary's older bands remain separate.
- Example recordings reference the existing web media files, without making duplicate copies: no7z / Jayoung HSK sentences audio, CC BY-SA 4.0, https://github.com/no7z/hsk-sentences-audio. These examples have not been independently reviewed. See `/data/learning/ATTRIBUTION.md` and `/THIRD_PARTY_NOTICES.md`.

Importing the dictionary does not import personal databases, accounts, study history, community messages or uploaded media from the mobile app. Community uses the existing service only after the user connects; no server schema is changed by this web integration.
