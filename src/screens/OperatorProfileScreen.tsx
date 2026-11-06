import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { SmallButton } from '../components/core';
import { ProfileIdentity, TagGroup } from '../components/patterns/Profile';
import { SettingsRow, SettingsSection, SettingsToggle } from '../components/patterns/Settings';
import { SettingsField, SettingsScreenShell, SettingsText, type SettingsScreenProps } from './SettingsScreenShell';

export type ProfileDetail = {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
};
export type OperatorProfile = { name: string; headline: string; location: string; summary: string; email: string; skills: string[]; links?: ProfileDetail[]; experience?: ProfileDetail[]; projects?: ProfileDetail[]; education?: ProfileDetail[]; targets?: ProfileDetail[] };
export type OperatorProfileScreenProps = SettingsScreenProps & { profile: OperatorProfile; onProfileChange: (profile: OperatorProfile) => void; preview?: boolean };
type EditableCollection = 'experience' | 'projects';

export function OperatorProfileScreen({ onBack, onAction, profile, onProfileChange, preview = false }: OperatorProfileScreenProps) {
  const [editing, setEditing] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [skill, setSkill] = useState('');
  const initials = profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');
  const editField = (label: string, key: 'name' | 'headline' | 'location' | 'summary' | 'email', multiline = false) => <SettingsField label={label} value={draft[key]} onChangeText={value => setDraft(old => ({ ...old, [key]: value }))} multiline={multiline} />;
  const changeDetail = (collection: EditableCollection, id: string, changes: Partial<ProfileDetail>) => setDraft(old => ({ ...old, [collection]: (old[collection] ?? []).map(item => item.id === id ? { ...item, ...changes } : item) }));
  const addDetail = (collection: EditableCollection) => setDraft(old => ({ ...old, [collection]: [...(old[collection] ?? []), { id: `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title: '', description: '' }] }));
  const removeDetail = (collection: EditableCollection, id: string) => setDraft(old => ({ ...old, [collection]: (old[collection] ?? []).filter(item => item.id !== id) }));
  const openProjectLink = (url: string, label: string) => {
    const address = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    Linking.openURL(address).catch(() => onAction(`Open ${label}`));
  };
  const dateRange = (entry: ProfileDetail) => [entry.startDate, entry.endDate].filter(Boolean).join(' – ');

  return <SettingsScreenShell title="Operator Profile" subtitle={preview ? 'Example profile · local preview' : undefined} onBack={onBack} headerAction={editing
    ? <View style={{ flexDirection: 'row', gap: 6 }}><SmallButton label="Cancel" icon="close" onPress={() => { setDraft(profile); setSkill(''); setEditing(false); }} /><SmallButton label="Save" icon="content-save-outline" variant="primary" onPress={() => { onProfileChange(draft); setEditing(false); }} /></View>
    : <SmallButton label="Edit" icon="pencil-outline" variant="primary" onPress={() => { setDraft(profile); setEditing(true); }} />}>
    <ProfileIdentity initials={initials || '?'} name={profile.name || 'Your profile'} headline={profile.headline} location={profile.location} />

    {editing
      ? <SettingsSection title="Personal details" icon="account-outline">{editField('Name', 'name')}{editField('Headline', 'headline')}{editField('Location', 'location')}{editField('Email Address', 'email')}{editField('Executive Summary', 'summary', true)}</SettingsSection>
      : <><SettingsSection title="Executive Summary" icon="text-account"><SettingsText>{profile.summary}</SettingsText></SettingsSection><SettingsSection title="Social & Web Profiles" icon="link-variant">{(profile.links ?? []).map(link => <SettingsRow key={link.id} title={link.title} description={link.description} onPress={() => onAction(`Open ${link.title}`)} />)}{profile.email ? <SettingsRow title="Email Address" description={profile.email} /> : !profile.links?.length ? <SettingsText>No links added.</SettingsText> : null}<SmallButton label="Add Link" icon="plus" onPress={() => onAction('Add profile link')} /></SettingsSection></>}

    <SettingsSection title="Skills & Competencies" icon="brain"><TagGroup title="Core skills" items={(editing ? draft.skills : profile.skills).map((label, index) => ({ id: String(index), label }))} onRemove={editing ? id => setDraft(old => ({ ...old, skills: old.skills.filter((_, index) => String(index) !== id) })) : undefined} />{editing && <><SettingsField label="New skill" value={skill} onChangeText={setSkill} /><SmallButton label="Add Skill" icon="plus" disabled={!skill.trim()} onPress={() => { const value = skill.trim(); if (value) { setDraft(old => ({ ...old, skills: [...old.skills, value] })); setSkill(''); } }} /></>}</SettingsSection>

    <SettingsSection title="Work Experience" icon="briefcase-outline">
      {((editing ? draft.experience : profile.experience) ?? []).map(entry => editing
        ? <View key={entry.id} style={{ gap: 6 }}><SettingsField label="Company or organization" value={entry.title} onChangeText={title => changeDetail('experience', entry.id, { title })} /><SettingsField label="Role and description" value={entry.description} onChangeText={description => changeDetail('experience', entry.id, { description })} multiline /><SettingsField label="Start date (optional)" value={entry.startDate ?? ''} onChangeText={startDate => changeDetail('experience', entry.id, { startDate })} placeholder="YYYY-MM" /><SettingsField label="End date (optional)" value={entry.endDate ?? ''} onChangeText={endDate => changeDetail('experience', entry.id, { endDate })} placeholder="YYYY-MM or Present" /><SmallButton label="Remove experience" icon="delete-outline" onPress={() => removeDetail('experience', entry.id)} /></View>
        : <SettingsRow key={entry.id} title={entry.title} description={[entry.description, dateRange(entry)].filter(Boolean).join(' · ')} />)}
      {!(editing ? draft.experience : profile.experience)?.length && <SettingsText>No experience added.</SettingsText>}
      <SmallButton label="Add Experience" icon="plus" onPress={() => editing ? addDetail('experience') : onAction('Add experience')} />
    </SettingsSection>

    <SettingsSection title="Projects & Implementations" icon="folder-outline">
      {((editing ? draft.projects : profile.projects) ?? []).map(project => editing
        ? <View key={project.id} style={{ gap: 6 }}><SettingsField label="Project name" value={project.title} onChangeText={title => changeDetail('projects', project.id, { title })} /><SettingsField label="Description" value={project.description} onChangeText={description => changeDetail('projects', project.id, { description })} multiline /><SettingsField label="GitHub URL (optional)" value={project.githubUrl ?? ''} onChangeText={githubUrl => changeDetail('projects', project.id, { githubUrl })} autoCapitalize="none" keyboardType="url" /><SettingsField label="Live URL (optional)" value={project.liveUrl ?? ''} onChangeText={liveUrl => changeDetail('projects', project.id, { liveUrl })} autoCapitalize="none" keyboardType="url" /><SmallButton label="Remove project" icon="delete-outline" onPress={() => removeDetail('projects', project.id)} /></View>
        : <View key={project.id}><SettingsRow title={project.title} description={project.description} />{project.githubUrl && <SettingsRow title="GitHub" description={project.githubUrl} onPress={() => openProjectLink(project.githubUrl!, 'GitHub')} />}{project.liveUrl && <SettingsRow title="Live project" description={project.liveUrl} onPress={() => openProjectLink(project.liveUrl!, 'live project')} />}</View>)}
      {!(editing ? draft.projects : profile.projects)?.length && <SettingsText>No projects added.</SettingsText>}
      <SmallButton label="Add Project" icon="plus" onPress={() => editing ? addDetail('projects') : onAction('Add project')} />
    </SettingsSection>

    <SettingsSection title="Education & Certifications" icon="school-outline">{(profile.education ?? []).map(entry => <SettingsRow key={entry.id} title={entry.title} description={entry.description} />)}{!profile.education?.length && <SettingsText>No education added.</SettingsText>}<SmallButton label="Add Education" icon="plus" onPress={() => onAction('Add education')} /></SettingsSection>
    <SettingsSection title="Target Vector & Pipeline" icon="target">{(profile.targets ?? []).map(entry => <SettingsRow key={entry.id} title={entry.title} description={entry.description} />)}{!profile.targets?.length && <SettingsText>No targets configured.</SettingsText>}</SettingsSection>
    <SettingsSection title="Vault & Security" icon="shield-outline"><SettingsText>Artifacts, credentials and security status require a connected service.</SettingsText><SettingsRow title="Authorized Agent Daemons" description="Session status unavailable" /><SettingsToggle title="Privacy Mode" description="Preview preference only" value={privacy} onValueChange={setPrivacy} /><SmallButton label="Export Operator Dossier" icon="export" onPress={() => onAction('Export operator dossier')} /><SmallButton label="Lock Workspace" icon="lock-outline" onPress={() => onAction('Lock workspace')} /></SettingsSection>
  </SettingsScreenShell>;
}
