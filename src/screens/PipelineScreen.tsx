import React, { useEffect, useMemo, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, AppIcon, Badge, IconAction, SmallButton } from '../components/core';
import { AppFooter } from '../components/patterns/AppFooter';
import { BottomSheet } from '../components/patterns/BottomSheet';
import { PageHeader, type FilterItem } from '../components/patterns/Navigation';
import { OpportunityCard, type Opportunity, type OpportunityAction } from '../components/patterns/OpportunityCard';
import { SearchBar } from '../components/patterns/SearchBar';
import { FilterSheet } from '../components/patterns/FilterSheet';
import { AddJobDescriptionSheet, type JobDescriptionInput } from '../components/patterns/AddJobDescriptionSheet';
import { FloatingAction } from '../components/patterns/FloatingAction';
import { ActionMenu, type ActionMenuItem } from '../components/patterns/ActionMenu';
import { useAppTheme, type AppColors, fonts } from '../theme';
import { matchesSearch } from '../utils/search';
import { usePullToRefresh, type RefreshHandler } from '../hooks/usePullToRefresh';

export type PipelineEvent = { id: string; title: string; time: string; description?: string; icon?: string };
export type PipelineStage = { id: string; label: string; state: 'complete' | 'current' | 'upcoming' };
export type PipelineItem = Opportunity & {
  actions: OpportunityAction[]; location?: string; teamInfo?: string; matchLabel?: string;
  stages?: PipelineStage[]; events?: PipelineEvent[]; resumeName?: string; payloadSummary?: string;
};
export type PipelineScreenProps = { items: PipelineItem[]; onNavigate: (destination: string) => void; onAction: (id: string, action: string) => void; onRefresh?: RefreshHandler; onFilterPress?: () => void; onAddJobDescription?: (input: JobDescriptionInput) => void };
export type PipelineContentProps = { items: PipelineItem[]; query: string; statusId: string; onAction: (id: string, action: string) => void; onView: (id: string) => void };

/** Reusable opportunity list for the pipeline screen and future embedded views. */
export function PipelineContent({ items, query, statusId, onAction, onView, onLongPress }: PipelineContentProps & { onLongPress: (id: string) => void }) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors); const { width } = useWindowDimensions();
  const desktopGrid = width >= 1280;
  const visible = useMemo(() => items.filter(item => (statusId === 'all' || item.status === statusId) && matchesSearch([item.company, item.role, item.status, item.employment], query)), [items, query, statusId]);
  return <View style={[styles.opportunities, desktopGrid && styles.opportunitiesGrid]}>{visible.length ? visible.map(item => <View key={item.id} style={[styles.opportunitySlot, desktopGrid && styles.opportunitySlotWide]}><OpportunityCard opportunity={item} actions={item.actions} onAction={(id, action) => action === 'view' ? onView(id) : onAction(id, action)} onLongPress={() => onLongPress(item.id)} /></View>) : <Card style={styles.panel}><Text style={styles.muted}>{items.length ? 'No opportunities match your search or filter.' : 'No opportunities yet.'}</Text></Card>}</View>;
}
export function PipelineScreen({ items, onNavigate, onAction, onRefresh, onFilterPress, onAddJobDescription }: PipelineScreenProps) {
  const { colors } = useAppTheme(); const insets = useSafeAreaInsets(); const styles = makeStyles(colors, Platform.OS === 'ios' ? insets.bottom + 64 : 0);
  const { width } = useWindowDimensions(); const desktop = Platform.OS === 'web' && width >= 1024;
  const refreshProps = usePullToRefresh(onRefresh);
  const [query, setQuery] = useState(''); const [statusId, setStatusId] = useState('all'); const [selectedId, setSelectedId] = useState<string | null>(null); const [actionId, setActionId] = useState<string | null>(null); const [filtersVisible, setFiltersVisible] = useState(false); const [addVisible, setAddVisible] = useState(false);
  const selected = items.find(item => item.id === selectedId);
  const actionOpportunity = items.find(item => item.id === actionId);
  const statuses = useMemo<FilterItem[]>(() => [{ id: 'all', label: 'All stages', count: items.length }, ...Array.from(new Set(items.map(item => item.status))).map(status => ({ id: status, label: status, count: items.filter(item => item.status === status).length }))], [items]);
  const opportunityActions: ActionMenuItem[] = actionOpportunity ? [
    ...actionOpportunity.actions.filter(action => action.id !== 'delete').map(action => ({ id: action.id, label: action.label, icon: action.icon as ActionMenuItem['icon'] })),
    { id: 'delete', label: 'Delete', icon: 'delete-outline', destructive: true, confirmation: { message: `Delete the ${actionOpportunity.company} opportunity?`, confirmLabel: 'Confirm delete' } },
  ] : [];
  const selectOpportunityAction = (action: string) => {
    if (!actionOpportunity) return;
    const id = actionOpportunity.id;
    setActionId(null);
    if (action === 'view') setSelectedId(id);
    else onAction(id, action);
  };
  useEffect(() => { if (statusId !== 'all' && !statuses.some(status => status.id === statusId)) setStatusId('all'); }, [statusId, statuses]);
  return <SafeAreaView edges={['top']} style={styles.screen}>
    <PageHeader title="Pipeline Tracker" action={<View style={styles.headerActions}>{desktop && <FloatingAction label="Add job" icon="plus" onPress={() => setAddVisible(true)} />}{onRefresh && <IconAction icon="sync" label="Refresh pipeline" onPress={refreshProps.onRefresh} />}</View>} />
    <View style={styles.contentArea}><ScrollView testID="pipeline-scroll" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll refreshControl={<RefreshControl {...refreshProps} />} contentContainerStyle={[styles.content, { paddingBottom: 24 + (Platform.OS === 'ios' ? insets.bottom + 64 : 0) }]}>
      <View key="search" style={styles.search}><SearchBar value={query} onChangeText={setQuery} placeholder="Search opportunities, companies, roles..." onFilterPress={() => setFiltersVisible(true)} /></View>
      <PipelineContent items={items} query={query} statusId={statusId} onAction={onAction} onView={setSelectedId} onLongPress={setActionId} />
    </ScrollView>
    {!desktop && <View pointerEvents="box-none" style={styles.floating}><FloatingAction label="Add job" icon="plus" onPress={() => setAddVisible(true)} /></View>}</View>
    <AppFooter selectedId="pipeline" onSelect={onNavigate} />
    <OpportunityDetailsSheet item={selected} onClose={() => setSelectedId(null)} onAction={onAction} />
    <ActionMenu visible={!!actionOpportunity} title={actionOpportunity ? `${actionOpportunity.company} actions` : 'Opportunity actions'} items={opportunityActions} onClose={() => setActionId(null)} onSelect={selectOpportunityAction} />
    <FilterSheet visible={filtersVisible} title="Filter pipeline" items={statuses} selectedId={statusId} onSelect={setStatusId} onClear={() => setStatusId('all')} onClose={() => setFiltersVisible(false)} />
    <AddJobDescriptionSheet visible={addVisible} onClose={() => setAddVisible(false)} onAdd={input => { if (onAddJobDescription) onAddJobDescription(input); else onAction('new', `add-${input.type}`); }} />
  </SafeAreaView>;
}
export function OpportunityDetailsSheet({ item, onClose, onAction }: { item?: PipelineItem; onClose: () => void; onAction: (id: string, action: string) => void }) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors);
  return <BottomSheet visible={!!item} title={item?.company ?? 'Opportunity'} closeLabel="Close details" onClose={onClose}>
    {item && <><ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetBody}>
      <View style={styles.sheetHeader}><Text style={[styles.muted, styles.grow]}>{item.role}</Text>{item.matchLabel && <Badge label={item.matchLabel} tone="success" />}</View>
      <Card style={styles.panel}><Text style={styles.label}>WORK & COMPENSATION</Text><Text style={styles.body}>{item.location ?? item.employment}</Text>{item.compensation && <Text style={styles.accent}>{item.compensation}</Text>}</Card>
      {item.teamInfo && <Card style={styles.panel}><Text style={styles.sectionTitle}>Team & role details</Text><Text style={styles.body}>{item.teamInfo}</Text></Card>}
      {!!item.stages?.length && <Card style={styles.panel}><Text style={styles.sectionTitle}>Application progress</Text><View style={styles.wrap}>{item.stages.map(stage => <Badge key={stage.id} label={`${stage.state === 'complete' ? '✓ ' : stage.state === 'current' ? '● ' : ''}${stage.label}`} tone={stage.state === 'complete' ? 'success' : stage.state === 'current' ? 'primary' : 'neutral'} />)}</View></Card>}
      {!!item.events?.length && <Card style={styles.panel}><Text style={styles.sectionTitle}>Lifecycle event history</Text>{item.events.map(event => <View key={event.id} style={styles.event}><AppIcon name={event.icon ?? 'clock-outline'} size={16} color={colors.primary} /><View style={styles.grow}><Text style={styles.eventTitle}>{event.title}</Text><Text style={styles.label}>{event.time}</Text>{event.description && <Text style={styles.body}>{event.description}</Text>}</View></View>)}</Card>}
      {item.resumeName && <Card style={styles.panel}><Text style={styles.sectionTitle}>Attached resume</Text><Text style={styles.body}>{item.resumeName}</Text></Card>}
      {item.payloadSummary && <Card style={styles.panel}><Text style={styles.sectionTitle}>Application details</Text><Text style={styles.body}>{item.payloadSummary}</Text></Card>}
    </ScrollView><View style={styles.sheetFooter}><SmallButton label="Dismiss" icon="close" onPress={onClose} style={styles.grow} />{item.actions.filter(action => action.id !== 'view').map(action => <SmallButton key={action.id} {...action} onPress={() => onAction(item.id, action.id)} style={styles.grow} />)}</View></>}
  </BottomSheet>;
}
const makeStyles = (c: AppColors, tabBarOffset = 0) => StyleSheet.create({ screen: { flex: 1, backgroundColor: c.background }, contentArea: { flex: 1, minHeight: 0 }, content: { paddingBottom: 24 }, headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 }, floating: { position: 'absolute', right: 16, bottom: 16 + tabBarOffset, zIndex: 1, alignItems: 'flex-end' }, search: { backgroundColor: c.background, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }, opportunities: { paddingHorizontal: 16, gap: 12 }, opportunitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch' }, opportunitySlot: { width: '100%' }, opportunitySlotWide: { width: '48%', flexGrow: 1, minWidth: 420 }, panel: { gap: 8 }, muted: { color: c.muted, fontSize: 12, lineHeight: 18 }, body: { color: c.text, fontSize: 12, lineHeight: 18 }, accent: { color: c.success, fontFamily: fonts.mono, fontSize: 12 }, label: { color: c.subtle, fontFamily: fonts.mono, fontSize: 10 }, title: { color: c.text, fontSize: 18, fontWeight: '700' }, sectionTitle: { color: c.text, fontSize: 14, fontWeight: '600' }, eventTitle: { color: c.text, fontSize: 12, fontWeight: '600' }, event: { flexDirection: 'row', gap: 8, paddingVertical: 4 }, wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 }, grow: { flex: 1 }, sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 }, sheetBody: { padding: 16, gap: 10 }, sheetFooter: { flexDirection: 'row', gap: 8, padding: 12 } });
