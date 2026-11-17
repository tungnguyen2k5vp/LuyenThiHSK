import { spawnSync } from 'node:child_process';
const capture = spawnSync(process.execPath, ['scripts/exam-browser-check.mjs'], { stdio: 'inherit', env: { ...process.env, HSK_TEST_URL: process.env.HSK_REPORT_URL ?? process.env.HSK_TEST_URL ?? 'http://127.0.0.1:4173' } });
if (capture.error) throw capture.error;
if (capture.status !== 0) process.exit(capture.status ?? 1);
const report = spawnSync('python', ['scripts/create-exam-report.py'], { stdio: 'inherit' });
if (report.error) throw report.error;
process.exitCode = report.status ?? 1;
