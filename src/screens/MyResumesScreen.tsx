import React, { useEffect, useMemo, useState } from 'react';
import { Platform, RefreshControl, ScrollView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { useAppTheme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionMenu, type ActionMenuItem } from '../components/patterns/ActionMenu';
import { CreateResumeAction, type CreateOption } from '../components/patterns/CreateResumeAction';
import type { FilterItem } from '../components/patterns/Navigation';
import { ResumeCard, type ResumeCardData, type ResumeCardProps } from '../components/patterns/ResumeCard';
import { SearchBar } from '../components/patterns/SearchBar';
import { FilterSheet } from '../components/patterns/FilterSheet';
import { EmptyLibraryState, LibraryScreenShell, type LibraryView } from './LibraryScreenShell';
import { matchesLibraryFilter, matchesLibrarySearch } from './libraryFilters';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import type { ResumeEditorFormData } from './ResumeEditorForm';

/** Filters are supplied by the host until the API contract defines lifecycle values. */
export type ResumeListItem = ResumeCardData & { filterIds: string[]; source?: string; form?: ResumeEditorFormData };
export type MyResumesScreenProps = {
  resumes: ResumeListItem[];
  templateCount: number;
  filters: Omit<FilterItem, 'count'>[];
  createOptions: CreateOption[];
  onViewChange: (view: LibraryView) => void;
  onNavigate: (destination: string) => void;
  onCreate: (optionId: string) => string | void;
  onImportPdf?: (uri: string, filename: string) => void;
  /** Optional notification that the menu opened. */
  onMore?: ResumeCardProps['onMore'];
  onPreview: (id: string) => void;
  onDuplicate: (id: string) => void;
  onOpen: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFilterPress?: () => void;
  onAddFilter?: () => void;
  onRefresh?: () => void | Promise<void>;
};
export type MyResumesContentProps = Pick<MyResumesScreenProps, 'resumes' | 'filters' | 'onMore' | 'onPreview' | 'onDuplicate' | 'onOpen' | 'onEdit' | 'onDelete' | 'onFilterPress' | 'onAddFilter' | 'onRefresh'> & { sticky?: boolean };
export function MyResumesContent({ resumes, filters, onMore, onPreview, onDuplicate, onOpen, onEdit, onDelete, onFilterPress, onAddFilter, onRefresh, sticky = false }: MyResumesContentProps) {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filterId, setFilterId] = useState('all');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const refreshControl = usePullToRefresh(onRefresh);
  const activeResume = resumes.find(item => item.id === actionId);
  const actions: ActionMenuItem[] = [{ id: 'open', label: 'Open in editor', icon: 'code-tags' }, { id: 'edit', label: 'Edit', icon: 'pencil-outline', disabled: !onEdit }, { id: 'preview', label: 'View PDF', icon: 'file-pdf-box' }, { id: 'duplicate', label: 'Duplicate', icon: 'content-copy' }, { id: 'delete', label: 'Delete', icon: 'delete-outline', destructive: true, disabled: !onDelete, confirmation: { message: 'Delete this resume?', confirmLabel: 'Confirm delete' } }];
  const selectAction = (id: string) => { if (!activeResume) return; const resumeId = activeResume.id; setActionId(null); if (id === 'open') onOpen(resumeId); else if (id === 'edit') onEdit?.(resumeId); else if (id === 'preview') onPreview(resumeId); else if (id === 'duplicate') onDuplicate(resumeId); else if (id === 'delete') onDelete?.(resumeId); };
  useEffect(() => { if (filterId !== 'all' && !filters.some(filter => filter.id === filterId)) setFilterId('all'); }, [filters, filterId]);
  const counts = useMemo(() => [{ id: 'all', label: 'All Resumes', count: resumes.length }, ...filters.filter(filter => filter.id !== 'all').map(filter => ({ ...filter, count: resumes.filter(resume => resume.filterIds.includes(filter.id)).length }))], [filters, resumes]);
  const visible = useMemo(() => {
    return resumes.filter(resume => matchesLibraryFilter(resume.filterIds, filterId) && matchesLibrarySearch([resume.filename, resume.target, resume.engine, resume.status, ...resume.skills], query));
  }, [resumes, query, filterId]);
  const controls = <View style={[styles.controls, { backgroundColor: colors.background }]}>
    <SearchBar value={query} onChangeText={setQuery} placeholder="Search LaTeX sources, skills, engines..." onFilterPress={() => setFiltersVisible(true)} />
  </View>;
  const desktopGrid = width >= 1280;
  const list = <View style={[styles.list, desktopGrid && styles.desktopList]}>{visible.length ? visible.map(resume => <View key={resume.id} style={[styles.resumeSlot, desktopGrid && styles.desktopResumeSlot]}><ResumeCard resume={resume} onPreview={onPreview} onMore={id => { setActionId(id); onMore?.(id); }} /></View>) : <EmptyLibraryState message={resumes.length ? 'No resumes match your search or filter.' : 'No resumes yet.'} />}</View>;
  const menu = <ActionMenu visible={!!activeResume} title={activeResume?.filename ?? 'Resume actions'} items={actions} onClose={() => setActionId(null)} onSelect={selectAction} />;
  const filterSheet = <FilterSheet visible={filtersVisible} title="Filter resumes" items={counts} selectedId={filterId} onSelect={setFilterId} onClear={() => setFilterId('all')} onClose={() => setFiltersVisible(false)} />;
  return sticky ? <><ScrollView testID="resume-scroll" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll refreshControl={<RefreshControl {...refreshControl} />} contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + (Platform.OS === 'ios' ? insets.bottom + 64 : 0) }]}><View key="controls">{controls}</View><View key="list">{list}</View></ScrollView>{menu}{filterSheet}</> : <>{controls}{list}{menu}{filterSheet}</>;

}
/** Standalone screen for hosts that do not use ResumeLibraryScreen. */
export function MyResumesScreen(props: MyResumesScreenProps) {
  const { width } = useWindowDimensions(); const desktop = Platform.OS === 'web' && width >= 1024;
  const createAction = props.createOptions.length > 0 ? <CreateResumeAction options={props.createOptions} onSelect={optionId => { const id = props.onCreate(optionId); if (id) props.onOpen(id); }} menuPlacement="below" /> : undefined;
  return <LibraryScreenShell title="My Resumes" view="resumes" resumeCount={props.resumes.length} templateCount={props.templateCount} onViewChange={props.onViewChange} onNavigate={props.onNavigate} scrollContent={false} headerAction={desktop ? createAction : undefined} floatingAction={!desktop && props.createOptions.length > 0 ? <CreateResumeAction options={props.createOptions} onSelect={optionId => { const id = props.onCreate(optionId); if (id) props.onOpen(id); }} /> : undefined}>
    <MyResumesContent {...props} sticky />
  </LibraryScreenShell>;
}

const styles = StyleSheet.create({ controls: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 12 }, scrollContent: { paddingBottom: 24 }, list: { paddingHorizontal: 16, gap: 12, paddingTop: 4 }, desktopList: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch' }, resumeSlot: { width: '100%' }, desktopResumeSlot: { width: '48%', flexGrow: 1, minWidth: 420 } });
