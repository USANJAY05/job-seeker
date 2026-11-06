import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon, Badge, Card } from '../components/core';
import { PageHeader } from '../components/patterns/Navigation';
import { useAppTheme, type AppColors, radii } from '../theme';

const prepAreas = [
  { id: 'interview', title: 'Interview practice', description: 'Practice role-specific questions and shape concise answers.', icon: 'account-voice' },
  { id: 'research', title: 'Company research', description: 'Keep company notes and important role details together.', icon: 'domain' },
  { id: 'checklist', title: 'Preparation checklist', description: 'Organize the steps to complete before your next interview.', icon: 'format-list-checks' },
];

export function PreparationScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const s = makeStyles(colors);
  return <SafeAreaView edges={['top']} style={s.screen}>
    <PageHeader title="Preparation" />
    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={[s.content, { paddingBottom: 24 + (Platform.OS === 'ios' ? insets.bottom + 64 : 0) }]}>
      <Card style={s.hero}>
        <View style={s.heroIcon}><AppIcon name="clipboard-check-outline" size={24} color={colors.primary} /></View>
        <View style={s.heroText}><Text style={s.eyebrow}>YOUR NEXT STEP</Text><Text style={s.heroTitle}>Get ready for the conversation.</Text><Text style={s.description}>Practice answers and organize the details that will help you feel prepared.</Text></View>
      </Card>
      <Text style={s.sectionTitle}>Preparation tools</Text>
      <View style={s.tools}>{prepAreas.map(area => <Card key={area.id} style={s.tool}>
        <View style={s.toolTop}><View style={s.toolIcon}><AppIcon name={area.icon} size={18} color={colors.primary} /></View><Badge label="Coming soon" tone="neutral" /></View>
        <Text style={s.toolTitle}>{area.title}</Text><Text style={s.description}>{area.description}</Text>
      </Card>)}</View>
    </ScrollView>
  </SafeAreaView>;
}

const makeStyles = (c: AppColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.background },
  content: { padding: 16, paddingBottom: 28, gap: 14 },
  hero: { gap: 12, padding: 18, backgroundColor: c.selection },
  heroIcon: { width: 48, height: 48, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surface },
  heroText: { gap: 4 }, eyebrow: { color: c.primary, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  heroTitle: { color: c.text, fontSize: 20, fontWeight: '700' },
  description: { color: c.muted, fontSize: 12, lineHeight: 18 },
  sectionTitle: { color: c.text, fontSize: 16, fontWeight: '700', marginTop: 4 },
  tools: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tool: { flex: 1, minWidth: 240, gap: 8, padding: 14 },
  toolTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toolIcon: { width: 36, height: 36, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surfaceRaised },
  toolTitle: { color: c.text, fontSize: 14, fontWeight: '600' },
});
