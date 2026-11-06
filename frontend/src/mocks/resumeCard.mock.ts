import type { ResumeListItem } from '../screens';

export const demoResumes: ResumeListItem[] = [
  { id: 'r1', filename: 'ML_Inference_Lead_Anthropic_v2.tex', target: 'Target: Anthropic • Model Serving', targetIcon: 'target', status: 'Primary', statusTone: 'success', atsScore: 98, engine: 'XeLaTeX', skills: ['Triton'], extraSkillCount: 2, compiledLabel: 'Compiled 14m ago', compileStatus: '0 err', filterIds: ['primary', 'production'] },
  { id: 'r2', filename: 'Founding_Engineer_SeriesA.tex', target: 'Target: Seed & Series A • Full Stack', targetIcon: 'rocket-launch-outline', status: 'Production', statusTone: 'secondary', atsScore: 95, engine: 'pdfLaTeX', skills: ['Next.js'], extraSkillCount: 3, compiledLabel: 'Compiled yesterday', compileStatus: 'Ready', filterIds: ['production'] },
  { id: 'r3', filename: 'Staff_Systems_Engineer.tex', target: 'Target: Infrastructure • Systems', status: 'Draft', engine: 'XeLaTeX', skills: ['Go', 'AWS'], compiledLabel: 'Compiled 2 days ago', compileStatus: 'Ready', filterIds: ['draft'] },
  { id: 'r4', filename: 'Platform_Engineer_Archive.tex', target: 'Target: Platform Engineering', status: 'Archived', engine: 'pdfLaTeX', skills: ['Kubernetes'], compiledLabel: 'Compiled last month', compileStatus: 'Archived', filterIds: ['archived'] },
];
