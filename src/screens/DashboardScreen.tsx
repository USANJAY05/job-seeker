import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon, SmallButton } from '../components/core';
import { AnalyticsTile, BreakdownChart, type BreakdownItem } from '../components/patterns/Analytics';
import { DistributionChart, ScoreLineChart, StackedBarChart, VerticalBarChart } from '../components/patterns/AnalyticsCharts';
import { PageHeader } from '../components/patterns/Navigation';
import { useAppTheme, type AppColors, radii } from '../theme';
import type { ResumeListItem } from './MyResumesScreen';
import type { PipelineItem } from './PipelineScreen';

export type DashboardScreenProps = { onNavigate: (destination: 'resumes' | 'pipeline' | 'settings') => void; onOpenProfile: () => void; onOpenFleet: () => void; onAction: (action: string) => void; onRefresh?: () => void | Promise<void>; resumes?: ResumeListItem[]; opportunities?: PipelineItem[]; dataLabel?: string };
const EMPTY_RESUMES: ResumeListItem[] = []; const EMPTY_OPPORTUNITIES: PipelineItem[] = [];
function statusBreakdown(items: { status: string }[]): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const item of items) { const label = item.status.trim() || 'Unspecified'; counts.set(label, (counts.get(label) ?? 0) + 1); }
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
function companyBreakdown(items: { company: string }[]): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const item of items) { const label = item.company.trim() || 'Unspecified'; counts.set(label, (counts.get(label) ?? 0) + 1); }
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
export function DashboardScreen({ onNavigate, onOpenProfile, onRefresh, resumes = EMPTY_RESUMES, opportunities = EMPTY_OPPORTUNITIES, dataLabel }: DashboardScreenProps) {
  const { colors } = useAppTheme(); const s = styles(colors);
  const { width } = useWindowDimensions();
  const wideCharts = width >= 1200;
  const [refreshing, setRefreshing] = useState(false);
  const pipelineBreakdown = useMemo(() => statusBreakdown(opportunities), [opportunities]);
  const resumeBreakdown = useMemo(() => statusBreakdown(resumes), [resumes]);
  const companyCounts = useMemo(() => companyBreakdown(opportunities), [opportunities]);
  const scores = useMemo(() => resumes.map(item => item.atsScore).filter((score): score is number => typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 100), [resumes]);
  const average = scores.length ? `${Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)}%` : '—';
  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try { await onRefresh?.(); }
    finally { setRefreshing(false); }
  };
  return <SafeAreaView edges={['top']} style={s.screen}>
    <PageHeader title="Home" />
    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primaryStrong]} /> }>
      <View style={s.intro}><View style={s.introText}><Text style={s.eyebrow}>YOUR WORKSPACE</Text><Text accessibilityRole="header" style={s.hero}>Your search at a glance</Text><Text style={s.description}>{dataLabel ?? 'Overview of your current workspace'}</Text></View><View style={s.heroIcon}><AppIcon name="chart-box-outline" size={26} color={colors.primary} /></View></View>
      <View style={s.sectionHeading}><Text accessibilityRole="header" style={s.sectionTitle}>Overview</Text></View>
      <View style={s.grid}><AnalyticsTile metric={{ label: 'Resumes', value: String(resumes.length), detail: 'In your library', icon: 'file-document-outline' }} onPress={() => onNavigate('resumes')} /><AnalyticsTile metric={{ label: 'Opportunities', value: String(opportunities.length), detail: 'In your pipeline', icon: 'source-branch' }} onPress={() => onNavigate('pipeline')} /><AnalyticsTile metric={{ label: 'Avg. resume ATS', value: average, detail: scores.length ? `${scores.length} scored ${scores.length === 1 ? 'resume' : 'resumes'}` : 'No scores available', icon: 'chart-line' }} /></View>
      <View style={s.sectionHeading}><Text accessibilityRole="header" style={s.sectionTitle}>Quick actions</Text></View>
      <View style={s.actions}><SmallButton label="Open Resumes" icon="file-document-outline" onPress={() => onNavigate('resumes')} /><SmallButton label="Open Pipeline" icon="source-branch" onPress={() => onNavigate('pipeline')} /><SmallButton label="Operator Profile" icon="account-outline" onPress={onOpenProfile} /></View>
      <View style={s.sectionHeading}><Text accessibilityRole="header" style={s.sectionTitle}>Pipeline overview</Text><Pressable accessibilityRole="button" accessibilityLabel="View Pipeline" onPress={() => onNavigate('pipeline')}><Text style={s.link}>View all</Text></Pressable></View>
      <View style={s.chartGrid}>
        <View style={[s.chartSlot, wideCharts && s.chartSlotWide]}><BreakdownChart style={wideCharts && s.fillCard} title="Opportunities by status" items={pipelineBreakdown} emptyMessage="Add opportunities to see their status breakdown." /></View>
        <View style={[s.chartSlot, wideCharts && s.chartSlotWide]}><VerticalBarChart style={wideCharts && s.fillCard} title="Opportunities by company" items={companyCounts} emptyMessage="Add opportunities to compare companies." /></View>
      </View>
      <View style={s.chartGrid}>
        <View style={[s.chartSlot, wideCharts && s.chartSlotWide]}>
          <View style={[s.recentPanel, wideCharts && s.fillCard]}>
            <View style={[s.sectionHeading, s.panelHeading]}><Text accessibilityRole="header" style={s.sectionTitle}>Recent opportunities</Text><Pressable accessibilityRole="button" accessibilityLabel="View Pipeline" onPress={() => onNavigate('pipeline')}><Text style={s.link}>View all</Text></Pressable></View>
            {opportunities.length > 0 ? <View style={s.list}>{opportunities.slice(0, 3).map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Open pipeline for ${item.company}`} onPress={() => onNavigate('pipeline')} style={s.opportunity}><View style={s.avatar}><Text style={s.initials}>{item.initials}</Text></View><View style={s.grow}><Text numberOfLines={1} style={s.company}>{item.company}</Text><Text numberOfLines={1} style={s.description}>{item.role}</Text></View><Text numberOfLines={2} style={s.status}>{item.status}</Text></Pressable>)}</View> : <Text style={s.description}>Add an opportunity to see it here.</Text>}
          </View>
        </View>
        <View style={[s.chartSlot, wideCharts && s.chartSlotWide]}><DistributionChart style={wideCharts && s.fillCard} title="Pipeline distribution" items={pipelineBreakdown} variant="pie" emptyMessage="Add opportunities to see the distribution." /></View>
      </View>
      <View style={s.sectionHeading}><Text accessibilityRole="header" style={s.sectionTitle}>Resume insights</Text><Pressable accessibilityRole="button" accessibilityLabel="View Resumes" onPress={() => onNavigate('resumes')}><Text style={s.link}>View all</Text></Pressable></View>
      <View style={s.chartGrid}>
        <View style={[s.chartSlot, wideCharts && s.chartSlotWide]}><DistributionChart style={wideCharts && s.fillCard} title="Resume distribution" items={resumeBreakdown} variant="donut" emptyMessage="Add resumes to see the distribution." /></View>
        <View style={[s.chartSlot, wideCharts && s.chartSlotWide]}><ScoreLineChart style={wideCharts && s.fillCard} title="Recorded ATS by resume" points={resumes.filter(item => typeof item.atsScore === 'number' && Number.isFinite(item.atsScore) && item.atsScore >= 0 && item.atsScore <= 100).map(item => ({ id: item.id, label: item.filename, value: item.atsScore as number }))} /></View>
        <View style={[s.chartSlot, wideCharts && s.chartSlotWide]}><BreakdownChart style={wideCharts && s.fillCard} title="Resumes by status" items={resumeBreakdown} emptyMessage="Add resumes to see your library breakdown." /></View>
        <View style={[s.chartSlot, wideCharts && s.chartSlotWide]}><StackedBarChart style={wideCharts && s.fillCard} title="Status mix by area" rows={[{ label: 'Resume library', segments: resumeBreakdown }, { label: 'Application pipeline', segments: pipelineBreakdown }]} emptyMessage="Add resumes or opportunities to compare status mix." /></View>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
const styles = (c: AppColors) => StyleSheet.create({ screen: { flex: 1, backgroundColor: c.background }, content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28, gap: 12 }, intro: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: radii.xl, backgroundColor: c.selection, gap: 12 }, introText: { flex: 1, gap: 4 }, eyebrow: { color: c.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1 }, hero: { color: c.text, fontSize: 20, fontWeight: '700' }, description: { color: c.muted, fontSize: 12, lineHeight: 17 }, heroIcon: { width: 48, height: 48, borderRadius: radii.lg, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }, sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }, panelHeading: { marginTop: 0, paddingHorizontal: 2 }, sectionTitle: { color: c.text, fontSize: 16, fontWeight: '700' }, link: { color: c.primary, fontSize: 12, fontWeight: '600', paddingVertical: 8 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, chartGrid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: 12 }, chartSlot: { width: '100%' }, chartSlotWide: { width: '48%', flexGrow: 1, minWidth: 340 }, fillCard: { flex: 1 }, recentPanel: { padding: 12, gap: 8, backgroundColor: c.surface, borderRadius: radii.xl }, list: { gap: 6 }, opportunity: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.surfaceLowest, borderRadius: radii.lg, padding: 12 }, avatar: { width: 36, height: 36, backgroundColor: c.surfaceRaised, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' }, initials: { color: c.primary, fontSize: 14, fontWeight: '700' }, grow: { flex: 1, minWidth: 0 }, company: { color: c.text, fontSize: 13, fontWeight: '700' }, status: { color: c.primary, fontSize: 11, maxWidth: 90, textAlign: 'right' }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });
