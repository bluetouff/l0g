import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { getCrisisGallery } from '../src/config/crisis-gallery.ts';
import { replayChapters, replaySources, retrospectiveSource } from '../src/data/crisis-replay.ts';
import { INITIAL_REPLAY_CHAPTER, parseReplayHash, replayHash, replayMapState } from '../src/lib/crisis-replay.ts';
import { crisisNetworks, networkMapState, isNetworkEpisode } from '../src/data/crisis-networks.ts';
import { replayEpisodes } from '../src/data/crisis-episodes.ts';

test('public chronology resolves every claim to a source available by that date', () => {
  assert.equal(new Set(replayChapters.map(c => c.id)).size, replayChapters.length);
  assert.equal(new Set(replaySources.map(s => s.id)).size, replaySources.length);
  let previous = '';
  for (const chapter of replayChapters) {
    assert.ok(chapter.date > previous);
    previous = chapter.date;
    const source = replaySources.find(s => s.id === chapter.source);
    assert.ok(source);
    assert.ok(source.published <= chapter.date, `${chapter.id}: future document used as contemporary evidence`);
    assert.ok(replaySources.some(s => s.id === retrospectiveSource(chapter)));
    for (const lang of ['fr', 'en']) {
      assert.ok(chapter.text[lang] && chapter.retrospective[lang]);
      assert.ok(chapter.fact.value[lang] && chapter.fact.label[lang]);
    }
  }
  for (const source of replaySources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(['www.bankofengland.co.uk', 'www.gov.uk', 'committees.parliament.uk'].includes(url.hostname));
    assert.equal(url.search, '');
  }
});

test('the Cunliffe letter uses its public date and the purchase-end confirmation follows the event', () => {
  assert.equal(replayChapters.find(c => c.id === 'diagnostic').date, '2022-10-06');
  assert.equal(replayChapters.find(c => c.id === 'fin-achats').date, '2022-10-17');
});

test('deep links preserve perspective, and hostile or missing input selects a safe default', () => {
  for (let i = 0; i < replayChapters.length; i++) {
    for (const mode of ['announcements', 'hindsight']) assert.deepEqual(parseReplayHash(replayHash(i, mode)), { index: i, mode });
    assert.equal(parseReplayHash(`#chapter-${replayChapters[i].id}`).index, i);
  }
  for (const hash of ['', '#etape=999999', '#etape=%3Cscript%3E', '#etape=%E0%A4%A', '#source-S04']) {
    assert.deepEqual(parseReplayHash(hash), { index: INITIAL_REPLAY_CHAPTER, mode: 'announcements' });
  }
  assert.equal(parseReplayHash('#etape=diagnostic&lecture=unknown').mode, 'announcements');
  for (const index of [-1, 9, NaN, Infinity]) assert.throws(() => replayHash(index, 'announcements'), RangeError);
});

test('map distinguishes later reconstruction, active operations and historical mechanism', () => {
  assert.equal(replayMapState(0, 'announcements').loop, false);
  assert.equal(replayMapState(3, 'announcements').purchases, true);
  assert.equal(replayMapState(3, 'announcements').loop, false);
  assert.equal(replayMapState(3, 'hindsight').retrospective, true);
  assert.equal(replayMapState(4, 'announcements').loop, true);
  assert.equal(replayMapState(4, 'announcements').repo, false);
  assert.equal(replayMapState(5, 'announcements').repo, true);
  assert.equal(replayMapState(7, 'announcements').purchases, false);
  assert.equal(replayMapState(7, 'announcements').repo, true);
  assert.equal(replayMapState(8, 'announcements').repo, false);
  assert.equal(replayMapState(8, 'announcements').exit, true);
  assert.throws(() => replayMapState(-1, 'announcements'), RangeError);
});

test('all episode chronologies resolve sources by public date, including simultaneous announcements', () => {
  for (const episode of Object.values(replayEpisodes)) {
    let previous = '';
    assert.equal(new Set(episode.chapters.map(c => c.id)).size, episode.chapters.length);
    for (const chapter of episode.chapters) {
      assert.ok(chapter.date >= previous);
      previous = chapter.date;
      assert.ok(episode.sources.find(s => s.id === chapter.source)?.published <= chapter.date);
      assert.ok(episode.sources.some(s => s.id === retrospectiveSource(chapter)));
      for (const mode of ['announcements', 'hindsight']) assert.deepEqual(parseReplayHash(replayHash(episode.chapters.indexOf(chapter), mode, episode.id),episode.id), {index:episode.chapters.indexOf(chapter),mode});
    }
    assert.equal(parseReplayHash('#etape=%3Cscript%3E',episode.id).index,episode.initialChapter);
  }
  assert.equal(parseReplayHash('#etape=intervention','svb').index,1);
  assert.equal(parseReplayHash('#etape=fermeture','gilts').index,3);
});

test('Terra separates the conversion loop, the selected halt and later reserve reporting', () => {
  assert.equal(replayMapState(0,'announcements','terra').loop,false);
  assert.equal(replayMapState(0,'hindsight','terra').retrospective,true);
  assert.equal(replayMapState(1,'announcements','terra').conversion,true);
  assert.equal(replayMapState(1,'announcements','terra').retrospective,false);
  assert.equal(replayMapState(2,'announcements','terra').halt,true);
  assert.equal(replayMapState(3,'announcements','terra').halt,false);
  assert.equal(replayMapState(3,'announcements','terra').exit,true);
  assert.equal(replayMapState(6,'announcements','terra').halt,false);
  const episode=replayEpisodes.terra;
  const reserveReport=episode.chapters.find(c=>c.id==='bilan-reserves');
  assert.equal(episode.sources.find(s=>s.id===reserveReport.source).published,'2022-05-16');
  assert.ok(episode.chapters.filter(c=>c.date<'2022-05-16').every(c=>!c.text.fr.includes('313')&&!c.text.en.includes('313')));
  for(const id of ['gilts','svb']) assert.equal(parseReplayHash('#etape=conversion-acceleree',id).index,replayEpisodes[id].initialChapter);
  assert.equal(parseReplayHash('#etape=fermeture','terra').index,episode.initialChapter);
  for(const index of [-1,7,NaN,Infinity,1.5]) assert.throws(()=>replayHash(index,'announcements','terra'),RangeError);
});

test('Terra source reproductions and actor references remain explicit and safe', () => {
  const episode=replayEpisodes.terra;
  for(const actor of episode.actors) assert.ok(episode.sources.some(source=>source.id===actor.source));
  for(const source of episode.sources) {
    assert.equal(new URL(source.url).protocol,'https:');
    if(source.reproduction) {
      assert.equal(new URL(source.reproduction).protocol,'https:');
      assert.match(source.scope.fr,/reproduction|retranscription|reproduite/);
    }
  }
  assert.match(episode.sources.find(source=>source.id==='T06').scope.fr,/amendé/);
  assert.equal(episode.chapters.find(c=>c.id==='diagnostic-bri').date,'2022-06-21');
});

test('SVB distinguishes receivership, deposit protection, BTFP and later run analysis', () => {
  assert.equal(replayMapState(0,'announcements','svb').resolution,false);
  assert.equal(replayMapState(1,'announcements','svb').resolution,true);
  assert.equal(replayMapState(1,'announcements','svb').protection,false);
  assert.equal(replayMapState(1,'announcements','svb').funding,false);
  assert.equal(replayMapState(1,'announcements','svb').loop,false);
  assert.equal(replayMapState(1,'hindsight','svb').retrospective,true);
  assert.equal(replayMapState(2,'announcements','svb').protection,true);
  assert.equal(replayMapState(2,'announcements','svb').funding,false);
  assert.equal(replayMapState(3,'announcements','svb').funding,true);
  assert.equal(replayMapState(6,'announcements','svb').loop,true);
  assert.equal(replayMapState(6,'announcements','svb').retrospective,false);
  assert.throws(()=>replayHash(7,'announcements','svb'),RangeError);
});

test('AIG reveals each cash channel by its document date and keeps Maiden Lane announcements separate', () => {
  const start=replayMapState(0,'announcements','aig');
  assert.equal(start.aigCredit,true);
  assert.equal(start.aigLending,false);
  assert.equal(start.aigCds,false);
  assert.equal(start.aigMl2,false);
  const retrospective=replayMapState(0,'hindsight','aig');
  assert.equal(retrospective.aigLendingRetro,true);
  assert.equal(retrospective.aigCdsRetro,true);
  assert.equal(retrospective.aigMl3,false);
  const october=replayMapState(1,'announcements','aig');
  assert.equal(october.aigLending,true);
  assert.equal(october.aigCds,false);
  assert.equal(replayMapState(1,'hindsight','aig').aigLendingRetro,false);
  assert.equal(replayMapState(1,'hindsight','aig').aigCdsRetro,true);
  const november=replayMapState(2,'announcements','aig');
  assert.equal(november.aigCds,true);
  assert.equal(november.aigMl2,true);
  assert.equal(november.aigMl3,true);
  assert.equal(november.retrospective,false);
  const episode=replayEpisodes.aig;
  assert.equal(episode.chapters.find(c=>c.id==='maiden-lane-iii').date,'2008-12-03');
  assert.equal(episode.chapters.find(c=>c.id==='maiden-lane-ii').date,'2008-12-16');
  assert.equal(episode.chapters.find(c=>c.id==='rapport-sigtarp').source,'A06');
  assert.equal(episode.sources.find(s=>s.id==='A06').published,'2009-11-17');
  for(const index of [-1,7,NaN,Infinity,1.5]) assert.throws(()=>replayHash(index,'announcements','aig'),RangeError);
});

test('AIG sources resolve actors, isolate episode hashes and preserve earlier consultation dates', () => {
  const episode=replayEpisodes.aig;
  for(const actor of episode.actors) assert.ok(episode.sources.some(source=>source.id===actor.source));
  for(const source of episode.sources) {
    const url=new URL(source.url);
    assert.equal(url.protocol,'https:');
    assert.ok(['www.federalreserve.gov','www.newyorkfed.org','fraser.stlouisfed.org'].includes(url.hostname));
    assert.equal(url.search,'');
  }
  for(const id of ['gilts','svb','terra']) {
    assert.equal(parseReplayHash('#etape=maiden-lane-iii',id).index,replayEpisodes[id].initialChapter);
    assert.equal(replayEpisodes[id].checkedAt,'2026-11-16');
  }
  assert.equal(parseReplayHash('#etape=intervention','aig').index,2);
  assert.equal(episode.checkedAt,'2026-11-17');
});


test('every gallery entry has a dedicated replay, responsive artwork and bilingual 1200 by 630 social images', async () => {
  for (const lang of ['fr','en']) {
    const cards=getCrisisGallery(lang);
    assert.equal(cards.length,Object.keys(replayEpisodes).length);
    assert.equal(new Set(cards.map(card=>card.href)).size,cards.length);
    for (const card of cards) {
      const page=readFileSync(new URL(`../src/pages${card.href.replace(/\/$/,'')}.astro`,import.meta.url),'utf8');
      assert.ok(page.includes(`/illustrations/crisis-replay/og/${card.id}-${lang}.jpg`));
      assert.ok(card.alt[lang] && card.summary[lang]);
      const social=await sharp(new URL(`../public/illustrations/crisis-replay/og/${card.id}-${lang}.jpg`,import.meta.url).pathname).metadata();
      assert.deepEqual([social.width,social.height,social.format],[1200,630,'jpeg']);
      for (const width of [640,960,1200]) {
        const art=await sharp(new URL(`../public/illustrations/crisis-replay/${card.art}-${width}.webp`,import.meta.url).pathname).metadata();
        assert.deepEqual([art.width,art.height,art.format],[width,width*9/16,'webp']);
      }
    }
    const collection=await sharp(new URL(`../public/illustrations/crisis-replay/og/collection-${lang}.jpg`,import.meta.url).pathname).metadata();
    assert.deepEqual([collection.width,collection.height,collection.format],[1200,630,'jpeg']);
  }
});

test('LTCM separates dated reconstruction, private equity, Fed facilitation and a conditional default scenario', () => {
  const start=replayMapState(0,'announcements','ltcm');
  assert.equal(start.ltcmModel,false);
  assert.equal(start.ltcmFunding,false);
  assert.equal(start.ltcmCapital,false);
  assert.equal(start.ltcmCoordination,false);
  const hindsight=replayMapState(0,'hindsight','ltcm');
  assert.equal(hindsight.ltcmModel,true);
  assert.equal(hindsight.ltcmRisk,true);
  assert.equal(hindsight.retrospective,true);
  assert.equal(hindsight.ltcmCapital,false);
  assert.equal(hindsight.ltcmCoordination,false);
  const policy=replayMapState(1,'announcements','ltcm');
  assert.equal(policy.ltcmCapital,false);
  assert.equal(policy.funding,false);
  const hearing=replayMapState(2,'announcements','ltcm');
  assert.equal(hearing.ltcmCapital,true);
  assert.equal(hearing.ltcmCoordination,true);
  assert.equal(hearing.ltcmRisk,true);
  assert.equal(hearing.retrospective,false);
  assert.equal(hearing.purchases,false);
  assert.equal(hearing.repo,false);
  const episode=replayEpisodes.ltcm;
  assert.equal(episode.sources.find(source=>source.id==='L08').published,'1999-11-19');
  assert.equal(episode.chapters.find(chapter=>chapter.id==='rapport-gao').date,'1999-11-19');
  assert.match(episode.sources.find(source=>source.id==='L08').scope.fr,/29 octobre/);
  assert.equal(episode.chapters.filter(chapter=>chapter.date==='1998-10-01').length,3);
  for(const actor of episode.actors) assert.ok(episode.sources.some(source=>source.id===actor.source));
  for(const index of [-1,8,NaN,Infinity,1.5]) assert.throws(()=>replayHash(index,'announcements','ltcm'),RangeError);
  for(const id of ['gilts','svb','terra','aig']) assert.equal(parseReplayHash('#etape=rapport-gao',id).index,replayEpisodes[id].initialChapter);
  assert.equal(parseReplayHash('#etape=maiden-lane-iii','ltcm').index,episode.initialChapter);
});

test('network relationships resolve actors and sources, and never import future events through hindsight', () => {
  for (const [id,network] of Object.entries(crisisNetworks)) {
    const episode=replayEpisodes[id];
    assert.equal(network.nodes.length,episode.actors.length);
    assert.equal(new Set(network.links.map(link=>link.id)).size,network.links.length);
    for (const actor of episode.actors) assert.ok(episode.sources.some(source=>source.id===actor.source));
    for (const link of network.links) {
      assert.ok(episode.actors.some(actor=>actor.id===link.from));
      assert.ok(episode.actors.some(actor=>actor.id===link.to));
      assert.ok(episode.sources.some(source=>source.id===link.source));
      assert.ok(!link.until||link.until>link.since);
      for (const chapter of episode.chapters) for (const mode of ['announcements','hindsight']) {
        const state=networkMapState(id,chapter.date,mode).links.find(item=>item.id===link.id);
        if(chapter.date<link.since||(link.until&&chapter.date>=link.until)) assert.equal(state.active,false);
        if(state.retrospective) assert.equal(mode,'hindsight');
      }
    }
    for(const index of [-1,NaN,Infinity,1.5,episode.chapters.length]) assert.throws(()=>replayHash(index,'announcements',id),RangeError);
  }
  assert.equal(isNetworkEpisode('__proto__'),false);
  assert.equal(isNetworkEpisode('constructor'),false);
  assert.equal(networkMapState('gilts','2022-09-28','announcements'),null);
});

test('Lehman separates conditional Treasury coverage from Fed-funded bank purchases', () => {
  const byId=(date,mode,id)=>networkMapState('lehman',date,mode).links.find(link=>link.id===id);
  assert.equal(byId('2008-09-16','hindsight','mmf-guarantee').active,false);
  assert.equal(byId('2008-09-16','hindsight','mmf-amlf').active,false);
  assert.equal(byId('2008-09-16','announcements','mmf-contagion').active,false);
  assert.equal(byId('2008-09-16','hindsight','mmf-contagion').retrospective,true);
  assert.equal(byId('2008-09-19','announcements','mmf-amlf').active,true);
  const guarantee=crisisNetworks.lehman.links.find(link=>link.id==='mmf-guarantee');
  assert.equal(guarantee.from,'treasury');assert.equal(guarantee.kind,'commitment');
  assert.equal(crisisNetworks.lehman.links.find(link=>link.id==='mmf-amlf').from,'banks');
  assert.match(crisisNetworks.lehman.method.en,/not a depiction of protection for Reserve Primary Fund/);
});

test('Asian program approvals retain their own country dates', () => {
  const state=(date)=>Object.fromEntries(networkMapState('asia',date,'hindsight').links.map(link=>[link.id,link.active]));
  assert.equal(state('1997-07-02')['asia-thai-program'],false);
  assert.equal(state('1997-08-20')['asia-thai-program'],true);
  assert.equal(state('1997-08-20')['asia-indo-program'],false);
  assert.equal(state('1997-11-05')['asia-indo-program'],true);
  assert.equal(state('1997-11-05')['asia-korea-program'],false);
  assert.equal(state('1997-12-04')['asia-korea-program'],true);
  assert.equal(replayEpisodes.asia.chapters.at(-1).date,'1998-06-19');
});

test('nickel reconstruction preserves suspension timing and the independent review scope', () => {
  const current=networkMapState('nickel','2022-03-08','announcements');
  assert.equal(current.suspended,true);assert.equal(current.links.find(link=>link.id==='nickel-cover').active,false);
  const later=networkMapState('nickel','2022-03-08','hindsight');
  assert.equal(later.links.find(link=>link.id==='nickel-cover').retrospective,true);
  assert.equal(networkMapState('nickel','2022-03-15','announcements').suspended,true);
  assert.equal(networkMapState('nickel','2022-03-29','announcements').suspended,false);
  assert.equal(networkMapState('nickel','2023-01-10','announcements').links.find(link=>link.id==='nickel-cover').retrospective,false);
  assert.match(replayEpisodes.nickel.sources.find(source=>source.id==='N06').scope.en,/excludes examination/);
});

test('Swiss floor withdrawal is irreversible in hindsight and keeps separate policy instruments', () => {
  for(const mode of ['announcements','hindsight']) {
    const before=networkMapState('chf','2014-12-18',mode);
    assert.equal(before.floor,true);assert.equal(before.links.find(link=>link.id==='chf-exposure').active,false);
    const withdrawn=networkMapState('chf','2015-01-15',mode);
    assert.equal(withdrawn.floor,false);assert.equal(withdrawn.links.find(link=>link.id==='chf-floor').active,false);
    assert.equal(withdrawn.links.find(link=>link.id==='chf-intervention').active,true);
  }
  assert.equal(networkMapState('chf','2011-09-06','hindsight').links.find(link=>link.id==='chf-negative').active,false);
  assert.equal(replayEpisodes.chf.sources.find(source=>source.id==='C07').published,'2016-12-11');
  assert.match(crisisNetworks.chf.method.en,/from 22 January/);
});

test('map notes follow the selected date without announcing future instruments or withdrawal', () => {
  const introduction=networkMapState('chf','2011-09-06','announcements');
  assert.doesNotMatch(introduction.note.en,/negative interest|removed/);
  const december=networkMapState('chf','2014-12-18','announcements');
  assert.match(december.note.en,/reaffirmed/);assert.doesNotMatch(december.note.en,/removed/);
  assert.match(networkMapState('chf','2015-01-15','announcements').note.en,/removed/);
  assert.doesNotMatch(networkMapState('lehman','2008-09-16','announcements').note.en,/Treasury|guarantee/);
  assert.match(networkMapState('lehman','2008-09-19','announcements').note.en,/Treasury/);
});

test('documented exposures and policy commitments respect their different publication dates', () => {
  const wire = (episode, date, mode, id) => networkMapState(episode, date, mode).links.find(link => link.id === id);
  const diversion = 'F05-ftx-alameda';
  assert.equal(wire('ftx', '2022-11-02', 'announcements', diversion).active, false);
  assert.equal(wire('ftx', '2022-11-02', 'hindsight', diversion).retrospective, true);
  assert.equal(wire('ftx', '2024-03-28', 'announcements', diversion).active, true);
  assert.equal(wire('euro', '2012-07-26', 'hindsight', 'Z04-ecb-market').active, false);
  assert.equal(wire('euro', '2012-09-06', 'announcements', 'Z01-ecb-market').active, false);
  assert.equal(wire('euro', '2012-09-06', 'announcements', 'Z04-ecb-market').active, true);
  assert.equal(wire('cash2020', '2020-03-23', 'hindsight', 'D04-official-fed').active, false);
  assert.equal(wire('cash2020', '2020-03-31', 'announcements', 'D04-official-fed').active, true);
  assert.equal(wire('argentina', '2001-12-03', 'hindsight', 'R05-state-holders').active, false);
  assert.equal(wire('archegos', '2021-03-29', 'hindsight', 'H03-family-brokers').retrospective, true);
  assert.equal(wire('wti', '2020-04-15', 'hindsight', 'W03-buyers-tanks').active, false);
});
