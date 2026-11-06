import type { LatexEngineInitial } from '../screens/LatexEngineScreen';
export const demoLatexEngine: LatexEngineInitial = { engine: 'xelatex', flags: '-interaction=nonstopmode -synctex=1 -halt-on-error', onePage: true, squeeze: 2, margin: 'strict', microtype: true, ats: true, sensitivity: 'balanced', packages: ['geometry', 'hyperref', 'enumitem', 'fontspec', 'titlesec'] };
