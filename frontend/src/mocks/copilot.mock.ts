import type { PromptAction, PromptShortcut } from '../screens/CopilotScreen';

export const demoQuickActions: PromptAction[] = [
  { id: 'job', title: 'Paste Job Spec', description: 'Start with a job description.', icon: 'content-paste', index: '01', prompt: 'Analyze this job description: ' },
  { id: 'url', title: 'ATS URL', description: 'Add a job posting link.', icon: 'link-variant', tone: 'success', index: '02', prompt: 'Review this job posting URL: ' },
  { id: 'tex', title: 'Macro Alignment', description: 'Review a resume for the role.', icon: 'console', tone: 'secondary', index: '03', prompt: 'Compare my resume with this role: ' },
  { id: 'outreach', title: 'Outreach Relay', description: 'Draft a hiring manager note.', icon: 'email-outline', index: '04', prompt: 'Help draft an outreach message for: ' },
];
export const demoShortcuts: PromptShortcut[] = [
  { id: 'url-shortcut', label: '+ URL', icon: 'link-variant', tone: 'success', prompt: 'Review this job posting URL: ' },
  { id: 'job-shortcut', label: '+ Paste JD', icon: 'file-document-outline', prompt: 'Analyze this job description: ' },
  { id: 'tex-shortcut', label: '+ Select .tex', icon: 'code-tags', tone: 'secondary', prompt: 'Compare my resume with this role: ' },
];
