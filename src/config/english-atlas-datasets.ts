import ai from '../data/engagement-atlas.json';
import aiEnglish from '../data/engagement-atlas.en.json';
import credit from '../data/private-credit-atlas.json';
import creditEnglish from '../data/private-credit-atlas.en.json';
import oil from '../data/oil-financing-atlas.json';
import oilEnglish from '../data/oil-financing-atlas.en.json';
import { localizeAtlas } from '../lib/atlas-localization.ts';

export const englishAtlasDatasets = {
  'ai-financing': localizeAtlas(ai, aiEnglish),
  'private-credit': localizeAtlas(credit, creditEnglish),
  'oil-financing': localizeAtlas(oil, oilEnglish),
};
