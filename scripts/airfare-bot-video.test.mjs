import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AIRFARE_DEMO_CAPTIONS as cues } from '../src/lib/airfare-demo-captions.ts';
import { AIRFARE_DEFAULTS, applyAirfareAction, calculateAirfareScenario } from '../src/lib/airfare-bot-model.ts';

const read = path => readFileSync(new URL('../' + path, import.meta.url));
function boxes(buffer) {
  const result = [];
  for (let offset = 0; offset < buffer.length;) {
    assert.ok(offset + 8 <= buffer.length);
    const shortSize = buffer.readUInt32BE(offset);
    const header = shortSize === 1 ? 16 : 8;
    assert.ok(offset + header <= buffer.length);
    const size = shortSize === 1 ? Number(buffer.readBigUInt64BE(offset + 8)) : shortSize === 0 ? buffer.length - offset : shortSize;
    assert.ok(Number.isSafeInteger(size) && size >= header && offset + size <= buffer.length, 'bounded MP4 box');
    result.push({ type: buffer.toString('ascii', offset + 4, offset + 8), data: buffer.subarray(offset + header, offset + size) });
    offset += size;
  }
  return result;
}

test('the short demo follows the real tool actions and their prices', () => {
  let state = AIRFARE_DEFAULTS;
  const prices = [];
  cues.forEach((cue, index) => {
    assert.equal(cue.start, index ? cues[index - 1].end : 0);
    assert.equal(cue.end - cue.start, 4);
    assert.ok(cue.fr.length < 110 && cue.en.length < 110);
    if (cue.action) state = applyAirfareAction(state, cue.action);
    prices.push(calculateAirfareScenario(state).price);
  });
  assert.equal(cues.at(-1).end, 32);
  assert.deepEqual(prices, [180, 180, 180, 240, 240, 300, 180, 180]);
});

test('FR/EN videos contain audio and H264 video, last 32 seconds and support progressive playback', () => {
  for (const lang of ['fr', 'en']) {
    const buffer = read(`public/videos/airfare-bots-v2-${lang}.mp4`);
    assert.ok(buffer.length > 100000 && buffer.length < 8 * 1024 * 1024);
    const top = boxes(buffer);
    assert.equal(top[0].type, 'ftyp');
    assert.ok(top.findIndex(box => box.type === 'moov') < top.findIndex(box => box.type === 'mdat'), 'metadata precedes media');
    const moov = top.find(box => box.type === 'moov');
    const metadata = moov.data.toString('latin1');
    for (const format of ['vide', 'soun', 'avc1', 'mp4a']) assert.ok(metadata.includes(format), format);
    const movie = boxes(moov.data).find(box => box.type === 'mvhd').data;
    assert.equal(movie[0], 0);
    const duration = movie.readUInt32BE(16) / movie.readUInt32BE(12);
    assert.ok(Math.abs(duration - 32) < 0.05);
    const poster = read(`public/videos/airfare-bots-v2-${lang}.png`);
    assert.equal(poster.readUInt32BE(16), 720);
    assert.equal(poster.readUInt32BE(20), 720);
    const subtitles = read(`public/videos/airfare-bots-v2-${lang}.vtt`).toString();
    assert.ok(subtitles.startsWith('WEBVTT\n'));
    assert.equal((subtitles.match(/ --> /g) || []).length, cues.length);
    for (const cue of cues) assert.ok(subtitles.includes(cue[lang]));
  }
});

test('the video sits directly below the simplified tool and loads only on demand', () => {
  for (const [lang, path] of [['fr', 'posts/billets-avion-agents-ia-signal-demande'], ['en', 'posts-en/airfares-ai-agents-demand-signals']]) {
    const article = read(`src/content/${path}.mdx`).toString();
    assert.match(article, new RegExp(`<AirfareBotLab lang="${lang}" />\\s*<AirfareBotVideo lang="${lang}" />`));
  }
  const video = read('src/components/AirfareBotVideo.astro').toString();
  assert.match(video, /<video controls playsinline preload="none"/);
  assert.doesNotMatch(video, /\bautoplay\b|<iframe|<script/);
  assert.match(video, /AIRFARE_DEMO_CAPTIONS\.map/);
  const component = read('src/components/AirfareBotLab.astro').toString();
  assert.equal((component.match(/data-action="/g) || []).length, 3);
  assert.doesNotMatch(component, /type="range"|data-mode=|data-price-chart|data-forecast|data-filter/);
});
