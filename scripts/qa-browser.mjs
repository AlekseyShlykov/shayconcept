import { writeFileSync } from 'node:fs';

const targets = await fetch('http://127.0.0.1:9222/json/list').then((response) => response.json());
const target = targets.find((item) => item.type === 'page');
if (!target) throw new Error('No Chrome page target found.');

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const events = [];
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  } else if (message.method) {
    events.push(message);
  }
});

function command(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const assertions = [];
function assert(condition, message) {
  assertions.push({ passed: Boolean(condition), message });
  if (!condition) throw new Error(message);
}

await Promise.all([
  command('Page.enable'),
  command('Runtime.enable'),
  command('Log.enable'),
]);

async function navigate(url) {
  events.length = 0;
  await command('Page.navigate', { url });
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (events.some((event) => event.method === 'Page.loadEventFired')) break;
    await wait(100);
  }
  await wait(700);
}

async function click(selector) {
  const clicked = await evaluate(`(() => { const node = document.querySelector(${JSON.stringify(selector)}); if (!node) return false; node.click(); return true; })()`);
  assert(clicked, `Element exists and can be clicked: ${selector}`);
}

await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await navigate('http://127.0.0.1:4173/');

const desktopLayout = await evaluate(`({
  width: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  title: document.title,
  sections: document.querySelectorAll('main > *').length,
  hero: document.querySelector('h1')?.textContent,
  svgPieces: document.querySelectorAll('[data-piece]').length,
  bodyHeight: document.body.scrollHeight
})`);
assert(desktopLayout.title === 'Shay — Systems Designer', 'Document title is correct');
assert(desktopLayout.sections === 4, 'All four top-level story sections render');
assert(desktopLayout.hero?.includes("I'm Shay"), 'Hero copy renders');
assert(desktopLayout.svgPieces === 32, 'All geometric fragments render');
assert(desktopLayout.scrollWidth <= desktopLayout.width, 'Desktop has no horizontal overflow');
assert(desktopLayout.bodyHeight > 4 * 900, 'Story has the expected scroll depth');

const heroShot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
writeFileSync('/private/tmp/shay-hero.png', Buffer.from(heroShot.data, 'base64'));

const initialTransform = await evaluate(`getComputedStyle(document.querySelector('[data-piece]')).transform`);
await evaluate(`(() => { const section = document.querySelector('#transformation'); const spacer = section.parentElement; window.scrollTo(0, spacer.offsetTop + spacer.offsetHeight - section.offsetHeight); })()`);
await wait(1600);
const finalScene = await evaluate(`({
  transform: getComputedStyle(document.querySelector('[data-piece]')).transform,
  clarity: Number(getComputedStyle(document.querySelector('[data-clarity]')).opacity),
  maxTransformDeviation: Math.max(...Array.from(document.querySelectorAll('[data-piece]')).map((node) => {
    const matrix = new DOMMatrix(getComputedStyle(node).transform);
    return Math.max(Math.abs(matrix.a - 1), Math.abs(matrix.b), Math.abs(matrix.c), Math.abs(matrix.d - 1), Math.abs(matrix.e), Math.abs(matrix.f));
  }))
})`);
assert(finalScene.transform !== initialTransform, 'Scrolling transforms the geometry');
assert(finalScene.clarity > 0.8, 'Clarity message appears near the end of the pinned sequence');
assert(finalScene.maxTransformDeviation < 0.05, 'Every fragment fully aligns into the final structure');
const houseShot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
writeFileSync('/private/tmp/shay-house.png', Buffer.from(houseShot.data, 'base64'));
await evaluate(`window.scrollTo(0, document.querySelector('#transformation').offsetTop)`);
await wait(900);
const reversedTransform = await evaluate(`getComputedStyle(document.querySelector('[data-piece]')).transform`);
assert(reversedTransform !== finalScene.transform, 'Reverse scrolling reverses the geometry transformation');

await evaluate(`document.querySelector('#diagnostic').scrollIntoView()`);
await wait(250);
await click('.answer-card:nth-of-type(1)');
await wait(500);
assert((await evaluate(`document.querySelector('.question-stage h2').textContent`)).includes('audited'), 'Question one advances to question two');
await click('.diagnostic-controls .text-button');
await wait(300);
assert((await evaluate(`document.querySelector('.question-stage h2').textContent`)).includes('biggest challenge'), 'Back returns to question one');
await click('.answer-card:nth-of-type(2)');
await wait(500);
await click('.answer-card:nth-of-type(3)');
await wait(500);
assert((await evaluate(`document.querySelector('.question-stage h2').textContent`)).includes('third question'), 'Question two advances to email capture');
await click('.email-row button');
assert((await evaluate(`document.querySelector('#email-error')?.textContent`)).includes('valid email'), 'Invalid email is rejected accessibly');
await evaluate(`(() => { const input = document.querySelector('#email'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(input, 'reader@example.com'); input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
await wait(100);
await click('.email-row button');
await wait(350);
assert((await evaluate(`document.querySelector('.question-stage h2').textContent`)).includes('demand most'), 'Valid email reveals question three');
await click('.answer-card:nth-of-type(2)');
await wait(1000);
const resultHeadline = await evaluate(`document.querySelector('.result-grid h2')?.textContent || ''`);
if (!resultHeadline.includes('knowledge exists')) {
  console.error('Result debug:', await evaluate(`({ headline: document.querySelector('.question-stage h2')?.textContent, selected: document.querySelector('.answer-card[aria-pressed="true"]')?.textContent, text: document.querySelector('#diagnostic')?.textContent?.slice(0, 600) })`));
}
assert(resultHeadline.includes('knowledge exists'), 'Knowledge Gap result is calculated from the selected path');
assert((await evaluate(`document.querySelector('.submission-note')?.textContent`)).includes('Preview mode'), 'Missing endpoint is explicitly identified as preview mode');

const desktopShot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
writeFileSync('/private/tmp/shay-desktop.png', Buffer.from(desktopShot.data, 'base64'));

await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await navigate('http://127.0.0.1:4173/');
const mobileLayout = await evaluate(`({
  width: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  heroHeight: document.querySelector('.hero').getBoundingClientRect().height,
  reducedTransform: getComputedStyle(document.querySelector('[data-piece]')).transform,
  clarity: Number(getComputedStyle(document.querySelector('[data-clarity]')).opacity)
})`);
assert(mobileLayout.scrollWidth <= mobileLayout.width, 'Mobile has no horizontal overflow');
assert(mobileLayout.heroHeight >= 844, 'Mobile hero fills the viewport');
assert(mobileLayout.reducedTransform === 'none', 'Reduced motion shows the settled house without transforms');
assert(mobileLayout.clarity === 1, 'Reduced motion keeps the final message visible');

await evaluate(`document.querySelector('#diagnostic').scrollIntoView()`);
await wait(150);
const mobileAnswerWidth = await evaluate(`document.querySelector('.answer-card').getBoundingClientRect().width`);
assert(mobileAnswerWidth >= 350, 'Answer cards remain comfortably tappable on mobile');
const mobileShot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
writeFileSync('/private/tmp/shay-mobile.png', Buffer.from(mobileShot.data, 'base64'));

const browserErrors = events.filter((event) =>
  event.method === 'Runtime.exceptionThrown' ||
  (event.method === 'Log.entryAdded' && ['error', 'warning'].includes(event.params.entry.level))
);
assert(browserErrors.length === 0, `Browser console has no errors or warnings (found ${browserErrors.length})`);

socket.close();
console.log(JSON.stringify({ assertions, desktopLayout, mobileLayout, screenshots: ['/private/tmp/shay-hero.png', '/private/tmp/shay-house.png', '/private/tmp/shay-desktop.png', '/private/tmp/shay-mobile.png'] }, null, 2));
