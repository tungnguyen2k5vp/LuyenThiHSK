# V14 performance

| Browser / scenario | V13 p95 ms | V14 p95 ms | Budget ms | Status |
| --- | --- | --- | --- | --- |
| chrome / navigation | 67.9 | 67.9 | 87.9 | WITHIN |
| chrome / choices | 67.6 | 67.7 | 87.6 | WITHIN |
| chrome / result | 127.1 | 119.0 | 147.1 | WITHIN |
| edge / navigation | 68.1 | 67.9 | 88.1 | WITHIN |
| edge / choices | 67.6 | 67.9 | 87.6 | WITHIN |
| edge / result | 93.1 | 106.2 | 113.1 | WITHIN |

20 alternating same-profile pairs per scenario after warmup; same attempt, revisions, data and isolated API. Two actions plus 2 RAF; navigation waits for actual image readiness. Not production Web Vitals. Catalog fetch duration is descriptive/unpaired: Chrome 362.6ms / Edge 394.6ms.

Retained failed harness runs: missing fixture dependencies, selector quoting, flag restore, Edge Runtime.evaluate timeout, missing progress-log directory. Diagnostic focus/bring-to-front runs did not change product timing or performance budget. No claim that the first Edge timeout was proven to be a product defect or proven to be one specific environmental cause.

Initial JS grew from V13 ~330.39kB (gzip100.69) to V14 ~396.78kB (gzip120.21); warm interaction results do not establish a cold-load speed improvement. Private API and first-load/mobile/network performance should continue to be monitored.
