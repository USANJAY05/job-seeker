import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, SmallButton } from '../components/core';
import { EditorField, EditorSection } from '../components/patterns/DocumentEditor';
import { useAppTheme, type AppColors, fonts, radii } from '../theme';

export type ResumeFormEntry = { id: string; title: string; subtitle: string; details: string[] };
export type ResumeSkillGroup = { id: string; title: string; skills: string[] };
export type ResumeEditorFormData = {
  fullName: string; headline: string; email: string; phone: string; location: string; profiles: string;
  projects: ResumeFormEntry[]; skillGroups: ResumeSkillGroup[]; experience: ResumeFormEntry[]; education: ResumeFormEntry[];
};
type EntrySection = 'projects' | 'experience' | 'education';
export type ResumeEditorFormProps = { value: ResumeEditorFormData; onChange: (value: ResumeEditorFormData) => void };

/** Structured UI data only; conversion to/from TeX is a future contract. */
export function ResumeEditorForm({ value, onChange }: ResumeEditorFormProps) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ contact: true, projects: true, skills: true, experience: true, education: true });
  const toggle = (id: string) => setExpanded(current => ({ ...current, [id]: !current[id] }));
  const addEntry = (section: EntrySection) => onChange({ ...value, [section]: [...value[section], { id: `${section}-${Date.now()}`, title: '', subtitle: '', details: [] }] });
  const field = (name: 'fullName' | 'headline' | 'email' | 'phone' | 'location' | 'profiles', label: string) => <EditorField label={label} value={value[name]} onChangeText={text => onChange({ ...value, [name]: text })} autoCapitalize={name === 'email' ? 'none' : 'sentences'} keyboardType={name === 'email' ? 'email-address' : name === 'phone' ? 'phone-pad' : 'default'} />;
  const changeEntry = (section: EntrySection, id: string, update: Partial<ResumeFormEntry>) => onChange({ ...value, [section]: value[section].map(entry => entry.id === id ? { ...entry, ...update } : entry) });
  const entryList = (section: EntrySection) => value[section].map(entry => <View key={entry.id} style={styles.entry}>
    <EditorField label={section === 'education' ? 'INSTITUTION OR QUALIFICATION' : section === 'experience' ? 'COMPANY' : 'PROJECT'} value={entry.title} onChangeText={title => changeEntry(section, entry.id, { title })} />
    <EditorField label={section === 'experience' ? 'ROLE & DATES' : 'DETAILS'} value={entry.subtitle} onChangeText={subtitle => changeEntry(section, entry.id, { subtitle })} />
    {entry.details.map((detail, index) => <EditorField key={`${entry.id}-${index}`} label={`BULLET ${index + 1}`} multiline value={detail} onChangeText={text => changeEntry(section, entry.id, { details: entry.details.map((old, i) => i === index ? text : old) })} />)}
    <SmallButton label="Add Bullet" icon="plus" onPress={() => changeEntry(section, entry.id, { details: [...entry.details, ''] })} />
  </View>);
  return <View style={styles.form}>
    <EditorSection title="Header & Contact Information" subtitle="Contact details" icon="card-account-details-outline" expanded={expanded.contact} onToggle={() => toggle('contact')}>{field('fullName','FULL NAME')}{field('headline','PROFESSIONAL HEADLINE')}<View style={styles.twoColumns}><View style={styles.column}>{field('email','EMAIL')}</View><View style={styles.column}>{field('phone','PHONE')}</View></View>{field('location','LOCATION')}{field('profiles','DIGITAL FOOTPRINT & PROFILES')}</EditorSection>
    <EditorSection title="Projects & Implementations" subtitle={`${value.projects.length} projects`} icon="folder-outline" expanded={expanded.projects} onToggle={() => toggle('projects')}>{entryList('projects')}<SmallButton label="Add project" icon="plus" onPress={() => addEntry('projects')} /></EditorSection>
    <EditorSection title="Technical Competencies" subtitle="Categorized skills" icon="console" expanded={expanded.skills} onToggle={() => toggle('skills')}>{value.skillGroups.map(group => <View key={group.id} style={styles.entry}><EditorField label="CATEGORY" value={group.title} onChangeText={title => onChange({ ...value, skillGroups: value.skillGroups.map(item => item.id === group.id ? { ...item, title } : item) })} /><Text style={styles.hint}>Enter comma-separated skills</Text><EditorField label="SKILLS" value={group.skills.join(',')} onChangeText={text => onChange({ ...value, skillGroups: value.skillGroups.map(item => item.id === group.id ? { ...item, skills: text.split(',') } : item) })} /><View style={styles.badges}>{group.skills.map((skill, index) => skill.trim() ? <Badge key={`${index}-${skill}`} label={skill.trim()} /> : null)}</View></View>)}<SmallButton label="Add skill category" icon="plus" onPress={() => onChange({ ...value, skillGroups: [...value.skillGroups, { id: `skills-${Date.now()}`, title: '', skills: [] }] })} /></EditorSection>
    <EditorSection title="Work Experience" subtitle={`${value.experience.length} entries`} icon="briefcase-outline" expanded={expanded.experience} onToggle={() => toggle('experience')}>{entryList('experience')}<SmallButton label="Add experience" icon="plus" onPress={() => addEntry('experience')} /></EditorSection>
    <EditorSection title="Education & Open Source" subtitle="Credentials & ecosystem" icon="school-outline" expanded={expanded.education} onToggle={() => toggle('education')}>{entryList('education')}<SmallButton label="Add education" icon="plus" onPress={() => addEntry('education')} /></EditorSection>
  </View>;
}
const makeStyles = (colors: AppColors) => StyleSheet.create({ form: { gap: 12 }, entry: { padding: 10, borderRadius: radii.md, backgroundColor: colors.surfaceLowest, gap: 8 }, twoColumns: { flexDirection: 'row', gap: 8 }, column: { flex: 1, minWidth: 0 }, groupTitle: { color: colors.text, fontSize: 13, fontWeight: '600' }, hint: { color: colors.subtle, fontFamily: fonts.mono, fontSize: 10 }, badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 } });
