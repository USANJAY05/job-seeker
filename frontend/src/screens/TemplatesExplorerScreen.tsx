import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { IconAction } from '../components/core';
import type { FilterItem } from '../components/patterns/Navigation';
import { FloatingAction } from '../components/patterns/FloatingAction';
import { SearchBar } from '../components/patterns/SearchBar';
import { FilterSheet } from '../components/patterns/FilterSheet';
import { TemplateCard, type TemplateAction, type TemplateCardData, type TemplatePlaceholder } from '../components/patterns/TemplateCard';
import { EmptyLibraryState, LibraryScreenShell, type LibraryView } from './LibraryScreenShell';
import { matchesLibraryFilter, matchesLibrarySearch } from './libraryFilters';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

export type TemplateListItem = TemplateCardData & { categoryIds: string[]; actions: TemplateAction[]; searchableTerms?: string[]; canBookmark?: boolean; verified?: boolean; source?: string; placeholders?: Record<string, TemplatePlaceholder> };
export type TemplatesExplorerScreenProps = {
  templates: TemplateListItem[];
  resumeCount: number;
  filters: Omit<FilterItem, 'count'>[];
  onViewChange: (view: LibraryView) => void;
  onNavigate: (destination: string) => void;
  onTemplateAction: (templateId: string, actionId: string) => string | void;
  onBookmark?: (templateId: string) => void;
  onUpload?: () => void;
  onNotifications?: () => void;
  onFilterPress?: () => void;
  onAddFilter?: () => void;
  onRefresh?: () => void | Promise<void>;
};
export type TemplateSearchState = { query: string; filterId: string };
export type TemplatesContentProps = Pick<TemplatesExplorerScreenProps, 'templates' | 'filters' | 'onTemplateAction' | 'onBookmark' | 'onFilterPress' | 'onAddFilter'> & { searchState?: TemplateSearchState; onSearchStateChange?: (state: TemplateSearchState) => void };
export function TemplatesContent({ templates, filters, onTemplateAction, onBookmark, onFilterPress, onAddFilter, searchState, onSearchStateChange }: TemplatesContentProps) {
  const [localState, setLocalState] = useState<TemplateSearchState>({ query: '', filterId: 'all' });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const { query, filterId } = searchState ?? localState;
  const updateState = (next: TemplateSearchState) => { if (searchState && onSearchStateChange) onSearchStateChange(next); else setLocalState(next); };
  const setQuery = (value: string) => updateState({ query: value, filterId });
  const setFilterId = (value: string) => updateState({ query, filterId: value });
  useEffect(() => { if (filterId !== 'all' && !filters.some(filter => filter.id === filterId)) { const next = { query, filterId: 'all' }; if (searchState && onSearchStateChange) onSearchStateChange(next); else setLocalState(next); } }, [filters, filterId, query, searchState, onSearchStateChange]);
  const counts = useMemo(() => [{ id: 'all', label: 'All Archetypes', count: templates.length }, ...filters.filter(filter => filter.id !== 'all').map(filter => ({ ...filter, count: templates.filter(template => template.categoryIds.includes(filter.id)).length }))], [filters, templates]);
  const visible = useMemo(() => {
    return templates.filter(template => matchesLibraryFilter(template.categoryIds, filterId) && matchesLibrarySearch([template.title, template.description, ...(template.searchableTerms ?? [])], query));
  }, [templates, query, filterId]);
  return <>
    <SearchBar value={query} onChangeText={setQuery} placeholder="Search templates, fonts, engines, tags..." onFilterPress={() => setFiltersVisible(true)} />
    <View style={styles.list}>{visible.length ? visible.map(template => <TemplateCard key={template.id} template={template} actions={template.actions} onAction={onTemplateAction} onBookmark={template.canBookmark ? onBookmark : undefined} />) : <EmptyLibraryState message={templates.length ? 'No templates match your search or filter.' : 'No templates available.'} />}</View>
    <FilterSheet visible={filtersVisible} title="Filter templates" items={counts} selectedId={filterId} onSelect={setFilterId} onClear={() => setFilterId('all')} onClose={() => setFiltersVisible(false)} />
  </>;
}
/** Standalone screen for hosts that do not use ResumeLibraryScreen. */
export function TemplatesExplorerScreen(props: TemplatesExplorerScreenProps) {
  const refreshProps = usePullToRefresh(props.onRefresh);
  return <LibraryScreenShell title="Templates Explorer" view="templates" resumeCount={props.resumeCount} templateCount={props.templates.length} onViewChange={props.onViewChange} onNavigate={props.onNavigate} refreshControl={<RefreshControl {...refreshProps} />} headerAction={props.onNotifications && <IconAction icon="bell-outline" label="Notifications" onPress={props.onNotifications} />} floatingAction={props.onUpload && <FloatingAction label="Upload TeX" icon="file-upload-outline" tone="success" onPress={props.onUpload} />}>
    <TemplatesContent {...props} />
  </LibraryScreenShell>;
}

const styles = StyleSheet.create({ list: { gap: 8 } });
