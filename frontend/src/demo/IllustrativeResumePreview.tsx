import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ResumeEditorFormData } from '../screens/ResumeEditorForm';

/** Illustrative layout only: it is not a compiled TeX document. */
export function IllustrativeResumePreview({ form }: { form: ResumeEditorFormData }) {
  return <View style={styles.frame}><Text style={styles.notice}>Illustrative layout only · not a compiled PDF</Text><View style={styles.paper}>
    <View style={styles.header}><Text style={styles.name}>{form.fullName || 'Your name'}</Text><Text style={styles.contact}>{[form.email, form.phone, form.location, form.profiles].filter(Boolean).join(' • ')}</Text></View>
    <Text style={styles.heading}>Technical Competencies</Text>{form.skillGroups.map(group => <Text key={group.id} style={styles.body}><Text style={styles.bold}>{group.title}: </Text>{group.skills.map(skill => skill.trim()).filter(Boolean).join(', ')}</Text>)}
    <Text style={styles.heading}>Projects & Implementations</Text>{form.projects.map(entry => <View key={entry.id} style={styles.entry}><Text style={styles.bold}>{entry.title}</Text><Text style={styles.body}>{entry.subtitle}</Text>{entry.details.filter(Boolean).map((detail, i) => <Text key={i} style={styles.body}>• {detail}</Text>)}</View>)}
    <Text style={styles.heading}>Experience</Text>{form.experience.map(entry => <View key={entry.id} style={styles.entry}><Text style={styles.bold}>{entry.title}</Text><Text style={styles.body}>{entry.subtitle}</Text>{entry.details.filter(Boolean).map((detail, i) => <Text key={i} style={styles.body}>• {detail}</Text>)}</View>)}
    <Text style={styles.heading}>Education & Open Source</Text>{form.education.map(entry => <View key={entry.id}><Text style={styles.bold}>{entry.title}</Text><Text style={styles.body}>{entry.subtitle}</Text>{entry.details.filter(Boolean).map((detail, i) => <Text key={i} style={styles.body}>{detail}</Text>)}</View>)}
  </View></View>;
}
const styles = StyleSheet.create({ frame: { backgroundColor: '#e1e1e8', borderRadius: 8, padding: 10, gap: 8 }, notice: { color: '#30303d', fontSize: 11, textAlign: 'center' }, paper: { backgroundColor: '#fcfcfd', padding: 18, minHeight: 500 }, header: { alignItems: 'center', borderBottomWidth: 1, borderColor: '#777777', paddingBottom: 8 }, name: { color: '#101010', fontFamily: 'Georgia', fontSize: 18, fontWeight: '700', textAlign: 'center' }, contact: { color: '#333333', fontFamily: 'Georgia', fontSize: 9, textAlign: 'center', lineHeight: 13, marginTop: 4 }, heading: { color: '#101010', fontFamily: 'Georgia', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', borderBottomWidth: 1, borderColor: '#444444', marginTop: 12, marginBottom: 5 }, body: { color: '#202020', fontFamily: 'Georgia', fontSize: 10, lineHeight: 15 }, bold: { color: '#101010', fontFamily: 'Georgia', fontSize: 10, fontWeight: '700' }, entry: { marginBottom: 6 } });
