import type { FleetAgent } from '../screens/AgentFleetScreen';

export const demoAgents: FleetAgent[] = [
  { id: 'ingestion', title: 'Job Ingestion Agent', description: 'JD parsing · ATS schema mapping', icon: 'file-search-outline', option: 'Salary filter' },
  { id: 'email', title: 'Email Drafting Agent', description: 'Pitch tailoring · factuality', icon: 'email-edit-outline', option: 'Strict factuality' },
  { id: 'research', title: 'Research & Intel Agent', description: 'Recruiter mapping · tech stack research', icon: 'magnify', option: 'Verified emails only' },
  { id: 'template', title: 'Template Conversion Agent', description: 'LaTeX AST · 1-page clamp', icon: 'code-tags', option: 'Strict margins' },
  { id: 'ats', title: 'ATS Scoring & Affinity', description: 'Keyword gap · matching', icon: 'clipboard-check-outline', option: 'Automatic suggestions' },
  { id: 'inbox', title: 'Inbox Monitoring Agent', description: 'Inbox polling · invite detection', icon: 'email-check-outline', option: 'Push alerts' },
];
