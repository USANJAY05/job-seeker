import type { ResumeListItem } from '../screens/MyResumesScreen';
import type { TemplateListItem } from '../screens/TemplatesExplorerScreen';
import type { PipelineItem } from '../screens/PipelineScreen';
import type { OperatorProfile } from '../screens/OperatorProfileScreen';
import type { ResumeEditorFormData } from '../screens/ResumeEditorForm';
import type { FleetAgent } from '../screens/AgentFleetScreen';
import type { LatexEngineInitial } from '../screens/LatexEngineScreen';
import type { DispatchSettingsInitial } from '../screens/DispatchSettingsScreen';
import type { EmailConfigurationInitial } from '../screens/EmailConfigurationScreen';
import type { RetentionPolicyInitial } from '../screens/RetentionPolicyScreen';
import { demoAgents, demoForm, demoPipeline, demoProfile, demoResumes, demoSource, demoTemplates, demoLatexEngine, demoDispatchSettings, demoEmailConfiguration, demoRetentionPolicy } from '../mocks';

export type AppDataMode = 'demo' | 'empty';
export type AppData = { resumes: ResumeListItem[]; templates: TemplateListItem[]; opportunities: PipelineItem[]; profile: OperatorProfile; agents: FleetAgent[]; editor: { source: string; form: ResumeEditorFormData }; settings: { latex?: LatexEngineInitial; dispatch?: DispatchSettingsInitial; email?: EmailConfigurationInitial; retention?: RetentionPolicyInitial } };
export function resolveDataMode(value: string | undefined, development: boolean): AppDataMode {
  if (value === 'demo') return 'demo';
  if (value === 'empty') return 'empty';
  if (value !== undefined && value !== '') return 'empty';
  return development ? 'demo' : 'empty';
}
const emptyProfile = (): OperatorProfile => ({ name: '', headline: '', location: '', summary: '', email: '', skills: [] });
const emptyEditor = (): AppData['editor'] => ({ source: '', form: { fullName: '', headline: '', email: '', phone: '', location: '', profiles: '', projects: [], skillGroups: [], experience: [], education: [] } });
/** Explicitly supplied data always wins, including empty arrays. Each mock instance is independent. */
export function createAppData(mode: AppDataMode, supplied: Partial<AppData> = {}): AppData {
  const sample: AppData = { resumes: demoResumes, templates: demoTemplates, opportunities: demoPipeline, profile: demoProfile, agents: demoAgents, editor: { source: demoSource, form: demoForm }, settings: { latex: demoLatexEngine, dispatch: demoDispatchSettings, email: demoEmailConfiguration, retention: demoRetentionPolicy } };
  const fallback: AppData = mode === 'demo' ? JSON.parse(JSON.stringify(sample)) as AppData : { resumes: [], templates: [], opportunities: [], profile: emptyProfile(), agents: [], editor: emptyEditor(), settings: {} };
  return { resumes: supplied.resumes ?? fallback.resumes, templates: supplied.templates ?? fallback.templates, opportunities: supplied.opportunities ?? fallback.opportunities, profile: supplied.profile ?? fallback.profile, agents: supplied.agents ?? fallback.agents, editor: supplied.editor ?? fallback.editor, settings: supplied.settings ?? fallback.settings };
}
