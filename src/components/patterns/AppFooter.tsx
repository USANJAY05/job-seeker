import React, { createContext, useContext, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

const FooterSuppressionContext = createContext(false);
/** Navigator-owned footers can suppress footers inside standalone screens. */
export function SuppressNestedFooters({ children }: { children: React.ReactNode }) {
  return <FooterSuppressionContext.Provider value>{children}</FooterSuppressionContext.Provider>;
}
import { BottomNavigation, NavigationRail, type NavigationItem } from './Navigation';

/** Default mobile destinations. The host owns navigation and supplies the active id. */
export const defaultFooterItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Home', icon: 'home-outline' },
  { id: 'resumes', label: 'Resumes', icon: 'file-document-outline' },
  { id: 'pipeline', label: 'Pipeline', icon: 'source-branch' },
  { id: 'preparation', label: 'Preparation', icon: 'clipboard-check-outline' },
  { id: 'settings', label: 'Settings', icon: 'cog-outline' },
];

export function AppFooter({ selectedId, onSelect, items = defaultFooterItems, railCollapsed: controlledCollapsed, onToggleRail }: {
  selectedId: string;
  onSelect: (id: string) => void;
  items?: NavigationItem[];
  railCollapsed?: boolean;
  onToggleRail?: () => void;
}) {
  const suppressed = useContext(FooterSuppressionContext);
  const { width } = useWindowDimensions();
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const railCollapsed = controlledCollapsed ?? localCollapsed;
  return suppressed ? null : Platform.OS === 'web' && width >= 1024
    ? <NavigationRail items={items} selectedId={selectedId} onSelect={onSelect} collapsed={railCollapsed} onToggleCollapse={onToggleRail ?? (() => setLocalCollapsed(value => !value))} />
    : <BottomNavigation items={items} selectedId={selectedId} onSelect={onSelect} />;
}
