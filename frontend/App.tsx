import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Geist_400Regular } from '@expo-google-fonts/geist';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JobBuddyThemeProvider, type ThemeMode } from './src/theme';
import { AppRouter } from './src/navigation/AppRouter';
import { ToastHost, showToast } from './src/components/patterns/Toast';
import { createOptions } from './src/config/resumeActions';
import { createAppData, resolveDataMode } from './src/data/appData';
import { IllustrativeResumePreview } from './src/demo/IllustrativeResumePreview';
import { ResumeEditorScreen } from './src/screens/ResumeEditorScreen';
import type { ResumeEditorFormData } from './src/screens/ResumeEditorForm';
import type { ResumeListItem } from './src/screens/MyResumesScreen';
import type { TemplateListItem } from './src/screens/TemplatesExplorerScreen';
import type { PipelineItem } from './src/screens/PipelineScreen';
import { PipelineScreen } from './src/screens/PipelineScreen';
import { AgentFleetScreen, DashboardScreen, DispatchSettingsScreen, EmailConfigurationScreen, LatexEngineScreen, OperatorProfileScreen, RetentionPolicyScreen, SettingsHomeScreen } from './src/screens';
import { AuthScreen } from './src/screens/AuthScreen';
import { ApiClient, JobBuddyApi } from './src/api';

const blankTexSource = '';
const PREVIEW_AUTH_KEY = 'job-buddy.preview-authenticated';
const emptyResumeForm = (): ResumeEditorFormData => ({ fullName: '', headline: '', email: '', phone: '', location: '', profiles: '', projects: [], skillGroups: [], experience: [], education: [] });

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Geist: Geist_400Regular, JetBrainsMono: JetBrainsMono_400Regular });
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  const [mode] = useState(() => apiBaseUrl ? 'empty' : resolveDataMode(process.env.EXPO_PUBLIC_APP_DATA_MODE, __DEV__));
  const [initialData] = useState(() => createAppData(mode));
  const api = useMemo(() => {
    return apiBaseUrl ? new JobBuddyApi(new ApiClient({ baseUrl: apiBaseUrl })) : undefined;
  }, []);
  const [resumes, setResumes] = useState<ResumeListItem[]>(initialData.resumes);
  const [templates, setTemplates] = useState<TemplateListItem[]>(initialData.templates);
  const [opportunities, setOpportunities] = useState<PipelineItem[]>(initialData.opportunities);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [authenticated, setAuthenticated] = useState(false);
  const [authStateReady, setAuthStateReady] = useState(false);
  const [profile, setProfile] = useState(initialData.profile);
  const [drafts, setDrafts] = useState<Record<string, { source: string; form: ResumeEditorFormData }>>({});
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(PREVIEW_AUTH_KEY).then(value => {
      if (!active) return;
      setAuthenticated(value === 'true');
      setAuthStateReady(true);
    }).catch(() => {
      if (active) setAuthStateReady(true);
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!api) return;
    let active = true;
    Promise.all([api.listResumes(), api.listTemplates(), api.getProfile()]).then(([serverResumes, serverTemplates, serverProfile]) => {
      if (!active) return;
      if (serverResumes) setResumes(serverResumes);
      if (serverTemplates) setTemplates(serverTemplates);
      if (serverProfile) setProfile(serverProfile);
    }).catch(() => {
      if (active) showToast('error', 'Backend unavailable', 'Could not load resumes, templates, and profile from the configured API.');
    });
    return () => { active = false; };
  }, [api]);
  useEffect(() => {
    if (!authStateReady) return;
    AsyncStorage.setItem(PREVIEW_AUTH_KEY, authenticated ? 'true' : 'false').catch(() => {});
  }, [authStateReady, authenticated]);
  if (!fontsLoaded && !fontError) return null;
  if (fontError) return <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}><Text>Unable to load the preview fonts. Restart the app to try again.</Text></View>;
  if (!authStateReady) return null;
  const comingSoon = (feature: string) => Alert.alert(feature, 'This feature will be connected in a later version.');
  const createResumeDraft = (filename: string, source: string, form = emptyResumeForm()) => {
    const id = `demo-resume-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const resume: ResumeListItem = { id, filename, target: 'Target role not set', status: 'Draft', statusTone: 'neutral', engine: 'XeLaTeX', skills: [], compiledLabel: 'Not compiled', compileStatus: 'Draft', filterIds: ['draft'] };
    setResumes(current => [resume, ...current]);
    setDrafts(current => ({ ...current, [id]: { source, form } }));
    api?.createResume({ ...resume, source, form }).catch(() => showToast('error', 'Resume not saved', 'The backend could not save this resume.'));
    return id;
  };
  return <SafeAreaProvider><JobBuddyThemeProvider mode={themeMode}>{authenticated ? <AppRouter
    resumes={{
      resumes,
      filters: [{ id: 'production', label: 'Production' }, { id: 'primary', label: 'Primary' }, { id: 'archived', label: 'Archived' }],
      createOptions,
      onCreate: option => option === 'blank' ? createResumeDraft('Untitled Resume.tex', blankTexSource) : undefined,
      onImportPdf: (_uri, filename) => showToast('info', 'PDF ready for conversion', `${filename} is selected. AI conversion is not connected yet.`),
      onRefresh: async () => { if (!api) { showToast('info', 'Resumes are up to date', 'Live refresh will be available when the API is connected.'); return; } try { setResumes(await api.listResumes() ?? []); } catch { showToast('error', 'Resume refresh failed', 'Could not load resumes from the backend.'); } },
      onPreview: () => comingSoon('PDF preview'),
      onDuplicate: id => {
        if (api) {
          api.duplicateResume(id).then(copy => { if (copy) { setResumes(previous => [copy, ...previous]); showToast('success', 'Resume duplicated', 'The copy was saved to the backend.'); } }).catch(() => showToast('error', 'Resume not duplicated', 'The backend could not duplicate this resume.'));
          return;
        }
        const source = resumes.find(item => item.id === id);
        if (!source) return;
        setResumes(previous => [{ ...source, id: `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`, filename: source.filename.replace(/\.tex$/i, '_copy.tex'), status: 'Draft', statusTone: 'neutral', highlighted: false, filterIds: ['draft'] }, ...previous]);
        showToast('success', 'Demo copy created', 'This change is local to the preview.');
      },
      onOpen: () => comingSoon('Resume editor'),
      onEdit: () => comingSoon('Edit resume'),
      onDelete: id => {
        if (api) {
          api.deleteResume(id).then(() => { setResumes(previous => previous.filter(item => item.id !== id)); setDrafts(previous => { const next = { ...previous }; delete next[id]; return next; }); }).catch(() => showToast('error', 'Resume not deleted', 'The backend could not delete this resume.'));
          return;
        }
        setResumes(previous => previous.filter(item => item.id !== id));
        setDrafts(previous => { const next = { ...previous }; delete next[id]; return next; });
        showToast('info', 'Resume removed', 'This change is local to the preview.');
      },
    }}
    templates={{
      templates,
      filters: [{ id: 'ats', label: 'ATS Ultra-Clean', icon: 'shield-check-outline' }, { id: 'academic', label: 'Deedy / Academic' }, { id: 'executive', label: 'Executive 1-Page' }, { id: 'two-column', label: 'Two-Column Tech' }],
      onTemplateAction: (id, action) => {
        const template = templates.find(item => item.id === id);
        if (action === 'fork' && template?.verified && template.source) return createResumeDraft(`${template.title}.tex`, template.source);
        comingSoon(`Template ${action}`);
      },
      onBookmark: id => {
        const current = templates.find(item => item.id === id);
        if (!current) return;
        const bookmarked = !current.bookmarked;
        setTemplates(previous => previous.map(item => item.id === id ? { ...item, bookmarked } : item));
        api?.setTemplateBookmarked(id, bookmarked).catch(() => showToast('error', 'Bookmark not saved', 'The backend could not update this template.'));
      },
      onUpload: () => comingSoon('Upload TeX'),
      onNotifications: () => comingSoon('Notifications'),
      onRefresh: async () => { if (!api) { showToast('info', 'Templates are up to date', 'Live refresh will be available when the API is connected.'); return; } try { setTemplates(await api.listTemplates() ?? []); } catch { showToast('error', 'Template refresh failed', 'Could not load templates from the backend.'); } },
    }}
    renderEditor={({ resumeId, initialMode, onBack, onNavigate, desktopSplit }) => {
      const resume = resumes.find(item => item.id === resumeId);
      const draft = drafts[resumeId] ?? { source: resume?.source ?? initialData.editor.source, form: resume?.form ?? initialData.editor.form };
      const form = draft.form;
      const hasFormContent = [form.fullName, form.headline, form.email, form.phone, form.location, form.profiles].some(value => value.trim().length > 0)
        || [...form.projects, ...form.experience, ...form.education].some(entry => entry.title.trim() || entry.subtitle.trim() || entry.details.some(detail => detail.trim()))
        || form.skillGroups.some(group => group.title.trim() || group.skills.some(skill => skill.trim()));
      const updateDraft = (update: Partial<{ source: string; form: ResumeEditorFormData }>) => setDrafts(previous => ({ ...previous, [resumeId]: { ...(previous[resumeId] ?? initialData.editor), ...update } }));
      return <ResumeEditorScreen filename={resume?.filename ?? 'Resume.tex'} onFilenameChange={filename => setResumes(current => current.map(item => item.id === resumeId ? { ...item, filename } : item))} source={draft.source} onSourceChange={source => updateDraft({ source })} form={draft.form} onFormChange={form => updateDraft({ form })} initialMode={initialMode} onBack={onBack} onNavigate={onNavigate} onCompile={() => comingSoon('TeX compilation')} onSaveCompile={() => { if (api && resume) { api.updateResume(resumeId, { filename: resume.filename, source: draft.source, form: draft.form }).then(() => showToast('success', 'Resume saved', 'Your source and form are saved to the backend.')).catch(() => showToast('error', 'Resume not saved', 'The backend could not save this resume.')); } else Alert.alert('Draft kept in this preview', 'Compilation and permanent saving will be connected later.'); }} compilerStatus="Compiler not connected" formNotice="Form fields and TeX source are edited separately until a conversion service is connected." preview={hasFormContent ? <IllustrativeResumePreview form={form} /> : <View style={{ minHeight: 500, backgroundColor: '#fff' }} />} onDownload={() => comingSoon('Download PDF')} onSendToPipeline={() => comingSoon('Send to pipeline')} desktopSplit={desktopSplit} embedded />;
    }}
    renderPipeline={({ onNavigate }) => <PipelineScreen items={opportunities} onNavigate={onNavigate} onAction={(id, action) => { if (action === 'delete') { const target = opportunities.find(item => item.id === id); setOpportunities(current => current.filter(item => item.id !== id)); showToast('success', 'Opportunity deleted', `${target?.company ?? 'Opportunity'} was removed from this preview.`); } else comingSoon(`Pipeline ${action}`); }} onRefresh={() => showToast('info', mode === 'demo' ? 'Example data' : 'Not connected', 'Live pipeline data is not connected.')} onAddJobDescription={input => showToast('info', 'Job description received', `${input.type === 'link' ? 'Link' : input.type === 'text' ? 'Text' : 'Screenshot'} captured in this preview. Import processing is not connected yet.`)} />}
    renderDashboard={({ onNavigate, openSettings }) => <DashboardScreen resumes={resumes} opportunities={opportunities} dataLabel={mode === 'demo' ? 'Example data · stored in this preview' : 'Overview of your current workspace'} onNavigate={onNavigate} onOpenProfile={() => openSettings('profile')} onOpenFleet={() => openSettings('fleet')} onAction={comingSoon} onRefresh={() => showToast('info', 'Preview data is up to date', 'Live data refresh will be available when the API is connected.')} />}
    renderSettings={({ openSettings, onSignOut }) => <SettingsHomeScreen onOpen={openSettings} onSignOut={onSignOut} profile={profile} onAction={comingSoon} themeMode={themeMode} onThemeChange={setThemeMode} />}
    renderSettingsDetail={({ destination, onBack }) => {
      const props = { onBack, onAction: comingSoon };
      switch (destination) {
        case 'fleet': return <AgentFleetScreen {...props} agents={initialData.agents} />;
        case 'latex': return <LatexEngineScreen {...props} initial={initialData.settings.latex} />;
        case 'dispatch': return <DispatchSettingsScreen {...props} initial={initialData.settings.dispatch} />;
        case 'email': return <EmailConfigurationScreen {...props} initial={initialData.settings.email} />;
        case 'profile': return <OperatorProfileScreen {...props} preview={mode === 'demo'} profile={profile} onProfileChange={next => { setProfile(next); api?.updateProfile(next).catch(() => showToast('error', 'Profile not saved', 'The backend could not save your profile.')); }} />;
        case 'retention': return <RetentionPolicyScreen {...props} initial={initialData.settings.retention} />;
      }
    }}
    onNavigateOutside={destination => comingSoon(destination.charAt(0).toUpperCase() + destination.slice(1))}
    onSignOut={() => { setAuthenticated(false); showToast('success', 'Signed out', 'Your local preview session has ended.'); }}
  /> : <AuthScreen onForgotPassword={() => comingSoon('Password reset')} onSubmit={() => { setAuthenticated(true); showToast('info', 'Preview session', 'Authentication API is not connected; continuing to the local app preview.'); }} />}<ToastHost /></JobBuddyThemeProvider></SafeAreaProvider>;
}
