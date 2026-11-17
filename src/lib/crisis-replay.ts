import { getReplayEpisode, type ReplayEpisodeId } from '../data/crisis-episodes.ts';
import { networkMapState } from '../data/crisis-networks.ts';

export const INITIAL_REPLAY_CHAPTER = 3;
export type ReplayMode = 'announcements' | 'hindsight';
export function parseReplayHash(hash: string, episodeId: ReplayEpisodeId = 'gilts'): { index: number; mode: ReplayMode } {
  const episode = getReplayEpisode(episodeId);
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const id = hash.startsWith('#chapter-') ? hash.slice('#chapter-'.length) : params.get('etape');
  const index = episode.chapters.findIndex(chapter => chapter.id === id);
  return { index: index < 0 ? episode.initialChapter : index, mode: params.get('lecture') === 'recul' ? 'hindsight' : 'announcements' };
}
export function replayHash(index: number, mode: ReplayMode, episodeId: ReplayEpisodeId = 'gilts'): string {
  const chapter = getReplayEpisode(episodeId).chapters[index];
  if (!chapter) throw new RangeError('Unknown replay chapter');
  return `#etape=${chapter.id}${mode === 'hindsight' ? '&lecture=recul' : ''}`;
}
/** Relationship colours express documentary visibility, never a measured stress score. */
export function replayMapState(index: number, mode: ReplayMode, episodeId: ReplayEpisodeId = 'gilts') {
  const chapter = getReplayEpisode(episodeId).chapters[index];
  if (!chapter) throw new RangeError('Unknown replay chapter');
  const ltcm = { ltcmModel:false, ltcmCapital:false, ltcmCoordination:false, ltcmFunding:false, ltcmRisk:false };
  const aig = { ...ltcm, aigCredit:false, aigLending:false, aigCds:false, aigMl2:false, aigMl3:false, aigLendingRetro:false, aigCdsRetro:false };
  const terra = { conversion:false, support:false, halt:false, ...aig };
  const network=networkMapState(episodeId,chapter.date,mode);
  if (network) return { ...terra, loop:false,purchases:false,repo:false,retrospective:network.retrospective,exit:false,securities:false,resolution:false,protection:false,funding:false };
  if (episodeId === 'ltcm') {
    const available=mode==='hindsight'||chapter.date>='1998-10-01';
    return { ...terra, loop:available, purchases:false, repo:false, retrospective:available&&chapter.date<'1998-10-01', exit:false,
      securities:false, resolution:false, protection:false, funding:false,
      ltcmModel:available,ltcmFunding:available,ltcmRisk:available,
      ltcmCapital:chapter.date>='1998-10-01',ltcmCoordination:chapter.date>='1998-10-01' };
  }
  if (episodeId === 'aig') {
    const aigLendingRetro = mode === 'hindsight' && chapter.date < '2008-10-08';
    const aigCdsRetro = mode === 'hindsight' && chapter.date < '2008-11-10';
    const aigLending = aigLendingRetro || chapter.date >= '2008-10-08';
    const aigCds = aigCdsRetro || chapter.date >= '2008-11-10';
    return { ...terra, loop:aigLending || aigCds, purchases:false, repo:false, retrospective:aigLendingRetro || aigCdsRetro, exit:chapter.phase === 'exit',
      securities:false, resolution:false, protection:false, funding:false,
      aigCredit:true, aigLending, aigCds, aigMl2:chapter.date >= '2008-11-10', aigMl3:chapter.date >= '2008-11-10', aigLendingRetro, aigCdsRetro };
  }
  if (episodeId === 'terra') {
    const loop = mode === 'hindsight' || chapter.date >= '2022-05-11';
    return { ...aig, loop, purchases:false, repo:false, retrospective:loop && chapter.date < '2022-05-11', exit:chapter.phase === 'exit',
      securities:false, resolution:false, protection:false, funding:false,
      conversion:loop, support:true, halt:chapter.id === 'arret-chaine' };
  }
  if (episodeId === 'svb') {
    const loop = mode === 'hindsight' || chapter.date >= '2023-04-28';
    return { ...terra, loop, purchases:false, repo:false, retrospective:loop && chapter.date < '2023-04-28', exit:chapter.phase === 'exit',
      securities:true, resolution:chapter.date >= '2023-03-10', protection:index >= 2, funding:index >= 3 };
  }
  const loop = mode === 'hindsight' || chapter.date >= '2022-10-06';
  const purchases = chapter.date >= '2022-09-28' && chapter.date < '2022-10-17';
  const repo = chapter.date >= '2022-10-10' && chapter.date < '2023-01-12';
  return { ...terra, loop, purchases, repo, retrospective: mode === 'hindsight' && chapter.date < '2022-10-06', exit: chapter.phase === 'exit',
    securities:false, resolution:false, protection:false, funding:false };
}
