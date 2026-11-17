import { spawn, spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const baseUrl = process.env.HSK_REPORT_URL ?? 'http://127.0.0.1:4173';
const chromePath = process.env.HSK_BROWSER_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outputRoot = path.resolve('docs/screenshots/current-web');
const inventoryPath = path.join(outputRoot, 'inventory.json');
const profilePath = await mkdtemp(path.join(os.tmpdir(), 'hsk-report-capture-'));
const browser = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', '--user-data-dir=' + profilePath, 'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });

let socket;
let sessionId;
let requestId = 0;
const pending = new Map();
const screenshots = [];
const pause = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const endpoint = await new Promise((resolve, reject) => {
  let stderr = '';
  const timeout = setTimeout(() => reject(new Error('Chrome did not start')), 15000);
  browser.on('error', reject);
  browser.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
    const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (match) { clearTimeout(timeout); resolve(match[1]); }
  });
});

function rpc(method, params = {}, attached = true) {
  const id = ++requestId;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error('Chrome DevTools timeout: ' + method));
    }, 20000);
    pending.set(id, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id, method, params, ...(attached && sessionId ? { sessionId } : {}) }));
  });
}

async function evaluate(expression) {
  const result = await rpc('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  }
  return result.result.value;
}

async function waitFor(expression, label = expression) {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (await evaluate('Boolean(' + expression + ')')) return;
    await pause(100);
  }
  const body = await evaluate('document.body.innerText.slice(0, 1400)');
  throw new Error('UI timeout: ' + label + '\n' + body);
}

async function clickIndex(selector, index = 0) {
  await evaluate(`(() => {
    const element = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
    if (!element || element.disabled) throw new Error('Button unavailable: ' + ${JSON.stringify(selector)} + '[' + ${index} + ']');
    element.click();
  })()`);
  await pause();
}

async function clickText(selector, snippet, index = 0) {
  await evaluate(`(() => {
    const matches = Array.from(document.querySelectorAll(${JSON.stringify(selector)}))
      .filter((element) => element.getClientRects().length && element.textContent.includes(${JSON.stringify(snippet)}));
    const element = matches[${index}];
    if (!element || element.disabled) throw new Error('Button unavailable for text: ' + ${JSON.stringify(snippet)});
    element.click();
  })()`);
  await pause();
}

async function setViewport(width, height, mobile) {
  await rpc('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile,
  });
  if (mobile) await rpc('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
  else await rpc('Emulation.setTouchEmulationEnabled', { enabled: false });
  await pause(300);
}

async function saveScreenshot(id, title, device, fullPage) {
  await evaluate('window.scrollTo({ top: 0, left: 0, behavior: "instant" })');
  await evaluate('document.fonts.ready.then(() => true)');
  await pause(200);
  const viewport = await rpc('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const viewportFile = `${id}-${device}-viewport.png`;
  await writeFile(path.join(outputRoot, viewportFile), Buffer.from(viewport.data, 'base64'));

  let fullPageFile;
  if (fullPage) {
    const metrics = await rpc('Page.getLayoutMetrics');
    const size = metrics.cssContentSize ?? metrics.contentSize;
    const clip = {
      x: 0, y: 0,
      width: Math.ceil(size.width), height: Math.ceil(size.height),
      scale: 1,
    };
    const full = await rpc('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
    fullPageFile = `${id}-${device}-full.png`;
    await writeFile(path.join(outputRoot, fullPageFile), Buffer.from(full.data, 'base64'));
  }
  screenshots.push({ id, title, device, viewportFile, fullPageFile: fullPageFile ?? null });
  console.log(`Captured ${device}: ${title}${fullPage ? ' (viewport + full page)' : ''}`);
}

async function goTab(index, mobile = false) {
  await clickIndex(mobile ? '.mobile-bottom-nav button' : '.desktop-nav button', index);
}

async function openFirstPracticeCard(buttonIndex = 0) {
  await evaluate(`(() => {
    const card = Array.from(document.querySelectorAll('.card')).find((item) =>
      item.querySelector('h3') && item.querySelectorAll('button').length >= 2);
    if (!card) throw new Error('No exam card found');
    card.querySelectorAll('button')[${buttonIndex}].click();
  })()`);
  await waitFor('document.querySelector(".question-panel")', 'exam question panel');
  await pause();
}

try {
  await mkdir(outputRoot, { recursive: true });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const task = pending.get(message.id);
      pending.delete(message.id);
      clearTimeout(task.timeout);
      if (message.error) task.reject(new Error(message.error.message));
      else task.resolve(message.result);
    }
  };

  const target = await rpc('Target.createTarget', { url: 'about:blank' }, false);
  sessionId = (await rpc('Target.attachToTarget', { targetId: target.targetId, flatten: true }, false)).sessionId;
  await rpc('Runtime.enable');
  await rpc('Page.enable');
  await rpc('Network.enable');
  await setViewport(1440, 1000, false);
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error(`Website returned HTTP ${response.status}: ${baseUrl}`);
  await rpc('Page.navigate', { url: baseUrl });
  await waitFor('document.querySelector(".home-quick-actions")', 'home screen');

  await saveScreenshot('trang-chu', 'Trang chủ', 'desktop', true);

  await goTab(1);
  await waitFor('document.querySelector(".desktop-nav button:nth-child(2).active")', 'exam list');
  await saveScreenshot('danh-sach-bai-luyen', 'Danh sách bài luyện và bộ lọc', 'desktop', true);
  await evaluate(`(() => {
    const field = Array.from(document.querySelectorAll('select')).find((item) =>
      Array.from(item.options).some((option) => option.value === 'full'));
    if (!field) throw new Error('Full exam filter not found');
    field.value = 'full';
    field.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await waitFor('document.querySelector(".progress-empty-state") || document.querySelector(".card h3")', 'filtered exam list');
  await pause();
  await saveScreenshot('de-thi-day-du-chua-co', 'Bộ lọc đề đầy đủ chưa có bộ câu hỏi', 'desktop', false);
  await clickText('.card button', 'Đặt lại bộ lọc');
  await clickText('.card button', 'HSK 2.0');
  await openFirstPracticeCard();

  await evaluate('document.querySelector(".options-grid button")?.click()');
  await clickText('.question-panel button', 'Kiểm tra câu');
  await waitFor('document.querySelector(".answer-feedback")', 'practice answer feedback');
  await saveScreenshot('phien-luyen-co-giai-thich', 'Phiên luyện tập có giải thích', 'desktop', false);

  await evaluate('Array.from(document.querySelectorAll(".question-panel button.btn-primary")).at(-1)?.click()');
  await waitFor('document.querySelector("[role=dialog]")', 'submit confirmation dialog');
  await saveScreenshot('xac-nhan-nop-bai', 'Xác nhận nộp bài', 'desktop', false);
  await clickIndex('[role=dialog] button.btn-primary');
  await waitFor('document.querySelector(".result-summary-card")', 'exam result');
  await saveScreenshot('ket-qua-luyen-tap', 'Kết quả và phần xem lại câu trả lời', 'desktop', true);
  await clickIndex('.review-filter-buttons button', 1);
  await saveScreenshot('ket-qua-loc-cau-sai', 'Kết quả lọc câu sai và bỏ trống', 'desktop', false);
  await goTab(3);
  await waitFor('document.querySelector(".attempt-history-section")', 'progress screen');
  await saveScreenshot('tien-do-hoc-tap', 'Tiến độ học tập và lịch sử bài luyện', 'desktop', true);

  await goTab(2);
  await waitFor('document.querySelector(".flashcard-inner")', 'vocabulary flashcard');
  await saveScreenshot('tu-vung-flashcard', 'Từ vựng: flashcard tương tác', 'desktop', true);
  await clickText('button', 'Danh sách từ vựng');
  await waitFor('document.querySelector(".main-content table")', 'vocabulary list');
  await saveScreenshot('tu-vung-danh-sach', 'Từ vựng: danh sách tra cứu', 'desktop', true);
  await clickText('button', 'Tra cứu nét chữ');
  await waitFor('document.querySelector(".stroke-stage svg")', 'stroke lookup');
  await saveScreenshot('tu-vung-tra-net', 'Từ vựng: tra cứu thứ tự nét', 'desktop', true);

  await goTab(4);
  await waitFor('document.querySelector(".source-documents details")', 'source and license screen');
  await saveScreenshot('nguon-du-lieu', 'Nguồn dữ liệu, giấy phép và chính sách', 'desktop', true);
  await clickIndex('.source-documents details summary', 0);
  await saveScreenshot('nguon-du-lieu-mo-chi-tiet', 'Nguồn dữ liệu: nội dung tài liệu mở rộng', 'desktop', false);

  await rpc('Page.navigate', { url: baseUrl });
  await waitFor('document.querySelector(".home-quick-actions")', 'reset app for mobile screenshots');
  await setViewport(390, 844, true);
  await saveScreenshot('trang-chu', 'Trang chủ', 'mobile', true);
  await goTab(1, true);
  await saveScreenshot('danh-sach-bai-luyen', 'Danh sách bài luyện', 'mobile', true);
  await goTab(2, true);
  await waitFor('document.querySelector(".flashcard-inner")', 'mobile vocabulary flashcard');
  await saveScreenshot('tu-vung-flashcard', 'Từ vựng: flashcard tương tác', 'mobile', true);
  await clickText('button', 'Danh sách từ vựng');
  await saveScreenshot('tu-vung-danh-sach', 'Từ vựng: danh sách tra cứu', 'mobile', false);
  await clickText('button', 'Tra cứu nét chữ');
  await waitFor('document.querySelector(".stroke-stage svg")', 'mobile stroke lookup');
  await saveScreenshot('tu-vung-tra-net', 'Từ vựng: tra cứu thứ tự nét', 'mobile', false);
  await goTab(3, true);
  await saveScreenshot('tien-do-hoc-tap', 'Tiến độ học tập', 'mobile', true);
  await goTab(4, true);
  await saveScreenshot('nguon-du-lieu', 'Nguồn dữ liệu và bản quyền', 'mobile', true);

  await goTab(1, true);
  await openFirstPracticeCard();
  await saveScreenshot('phien-luyen-co-giai-thich', 'Phiên luyện tập', 'mobile', false);
  await evaluate('document.querySelector(".options-grid button")?.click()');
  await evaluate('Array.from(document.querySelectorAll(".question-panel button.btn-primary")).at(-1)?.click()');
  await waitFor('document.querySelector("[role=dialog]")', 'mobile submit confirmation dialog');
  await saveScreenshot('xac-nhan-nop-bai', 'Xác nhận nộp bài', 'mobile', false);
  await clickIndex('[role=dialog] button.btn-primary');
  await waitFor('document.querySelector(".result-summary-card")', 'mobile exam result');
  await saveScreenshot('ket-qua-luyen-tap', 'Kết quả bài luyện', 'mobile', false);

  await rpc('Page.navigate', { url: baseUrl });
  await waitFor('document.querySelector(".home-quick-actions")', 'home before timed mobile session');
  await setViewport(390, 844, true);
  await goTab(1, true);
  await evaluate(`(() => {
    const card = Array.from(document.querySelectorAll('.card')).find((item) =>
      item.querySelector('h3') && item.querySelectorAll('button').length >= 2);
    if (!card) throw new Error('No exam card found for timed mobile session');
    card.querySelectorAll('button')[1].click();
  })()`);
  await waitFor('document.querySelector(".exam-timer-pill")', 'timed mobile exam session');
  await saveScreenshot('phien-thi-co-gio', 'Phiên thi thử có giờ', 'mobile', false);

  await rpc('Page.navigate', { url: baseUrl });
  await waitFor('document.querySelector(".home-quick-actions")', 'home before timed desktop session');
  await setViewport(1440, 1000, false);
  await goTab(1);
  await evaluate(`(() => {
    const card = Array.from(document.querySelectorAll('.card')).find((item) =>
      item.querySelector('h3') && item.querySelectorAll('button').length >= 2);
    if (!card) throw new Error('No exam card found for timed desktop session');
    card.querySelectorAll('button')[1].click();
  })()`);
  await waitFor('document.querySelector(".exam-timer-pill")', 'timed desktop exam session');
  await saveScreenshot('phien-thi-co-gio', 'Phiên thi thử có giờ', 'desktop', false);
  await waitFor('JSON.parse(localStorage.getItem("hsk-study-data-v1")).sessions.length > 0', 'saved timed session');
  await rpc('Page.navigate', { url: baseUrl });
  await waitFor('document.querySelector(".home-quick-actions")', 'home with saved session');
  await waitFor('Array.from(document.querySelectorAll(".card")).some((card) => card.textContent.includes("TIẾP TỤC BÀI HỌC"))', 'continue learning card');
  await saveScreenshot('tiep-tuc-bai-do', 'Trang chủ có phiên học dở', 'desktop', false);

  await writeFile(inventoryPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    baseUrl,
    viewport: { desktop: '1440 × 1000 CSS px', mobile: '390 × 844 CSS px' },
    screenshots,
  }, null, 2), 'utf8');
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    await rpc('Browser.close', {}, false).catch(() => {});
    socket.close();
  }
  browser.kill();
  const tempRoot = path.resolve(os.tmpdir()) + path.sep;
  const resolvedProfile = path.resolve(profilePath);
  if (resolvedProfile.startsWith(tempRoot) && path.basename(resolvedProfile).startsWith('hsk-report-capture-')) {
    await rm(resolvedProfile, { recursive: true, force: true }).catch(() => {});
  }
}

const python = spawnSync('python', ['scripts/create-web-report.py', inventoryPath], { stdio: 'inherit' });
if (python.error) throw python.error;
if (python.status !== 0) process.exit(python.status ?? 1);

console.log(`Saved ${screenshots.length} viewport captures and ${screenshots.filter((item) => item.fullPageFile).length} full-page captures.`);
