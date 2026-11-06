import React, { useCallback, useState } from 'react';
import { Keyboard, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { StackActions, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppFooter, defaultFooterItems, SuppressNestedFooters } from '../components/patterns/AppFooter';
import { BottomSheet } from '../components/patterns/BottomSheet';
import { PreparationScreen, ResumeLibraryScreen, type ResumeLibraryScreenProps, type ResumeEditorMode, type SettingsDestination } from '../screens';
import { ResponsiveScene } from '../components/patterns/ResponsiveScene';
import { AppIcon } from '../components/core/AppIcon';
import { fonts, useAppTheme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type LibraryStackParamList = { Library: undefined; Editor: { resumeId: string; initialMode: ResumeEditorMode } };
export type FooterTabParamList = { dashboard: undefined; resumes: undefined; pipeline: undefined; preparation: undefined; settings: NavigatorScreenParams<SettingsStackParamList> | undefined };
export type SettingsStackParamList = { SettingsHome: undefined; SettingsDetail: { destination: SettingsDestination } };
export type LibraryRouteName = 'MyResumes' | 'Templates';
export type ScreenNavigationArgs = { onNavigate: (destination: string) => void };
export type EditorRouteArgs = ScreenNavigationArgs & { resumeId: string; initialMode: ResumeEditorMode; onBack: () => void; desktopSplit: boolean };
export type LibraryNavigatorProps = Omit<ResumeLibraryScreenProps, 'initialView' | 'resumeSelectionRequest'> & {
  initialRouteName?: LibraryRouteName;
  renderEditor?: (args: EditorRouteArgs) => React.ReactNode;
  renderPipeline?: (args: ScreenNavigationArgs) => React.ReactNode;
  renderDashboard?: (args: { onNavigate: (destination: 'resumes' | 'pipeline' | 'settings') => void; openSettings: (destination: SettingsDestination) => void }) => React.ReactNode;
  renderSettings?: (args: { openSettings: (destination: SettingsDestination) => void; onSignOut?: () => void }) => React.ReactNode;
  onSignOut?: () => void;
  renderSettingsDetail?: (args: { destination: SettingsDestination; onBack: () => void }) => React.ReactNode;
};
const Tabs = createBottomTabNavigator<FooterTabParamList>();
const NativeTabs = Platform.OS === 'ios' ? createNativeBottomTabNavigator<FooterTabParamList>() : null;
const Tab = (NativeTabs ?? Tabs) as any;
const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

/** A single footer is owned by the tab navigator, with detail stacks inside tabs. */
export function LibraryNavigator({ resumes, templates, onNavigateOutside, initialRouteName = 'MyResumes', renderEditor, renderPipeline, renderDashboard, renderSettings, renderSettingsDetail, onSignOut }: LibraryNavigatorProps) {
  const { width } = useWindowDimensions();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const desktop = Platform.OS === 'web' && width >= 1024;
  const useNativeTabs = Platform.OS === 'ios';
  const [resumeSelectionRequest, setResumeSelectionRequest] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeEditor, setActiveEditor] = useState<{ resumeId: string; initialMode: ResumeEditorMode } | null>(null);
  const footer = useCallback(({ state, navigation }: BottomTabBarProps) => {
    const active = state.routes[state.index].name;
    const onSelect = (destination: string) => {
      Keyboard.dismiss();
      const route = state.routes.find(item => item.name === destination);
      if (!route) { onNavigateOutside(destination); return; }
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (event.defaultPrevented) return;
      if (destination === 'resumes') setResumeSelectionRequest(value => value + 1);
      if (active === destination && route.state?.key) navigation.dispatch({ ...StackActions.popToTop(), target: route.state.key });
      if (active !== destination) navigation.navigate(route.name);
    };
    return <AppFooter selectedId={active} onSelect={onSelect} railCollapsed={sidebarCollapsed} onToggleRail={() => setSidebarCollapsed(value => !value)} />;
  }, [onNavigateOutside, sidebarCollapsed]);
  const tabBarOptions = ({ route }: { route: { name: keyof FooterTabParamList } }) => {
    const item = defaultFooterItems.find(candidate => candidate.id === route.name);
    return {
      headerShown: false,
      animation: 'none' as const,
      title: item?.label ?? route.name,
      tabBarLabel: item?.label ?? route.name,
      tabBarIcon: useNativeTabs
        ? { type: 'sfSymbol' as const, name: ({ 'home-outline': 'house', 'file-document-outline': 'doc.text', 'source-branch': 'arrow.triangle.branch', 'clipboard-check-outline': 'checklist', 'cog-outline': 'gearshape' } as Record<string, string>)[item?.icon ?? ''] ?? 'circle' }
        : ({ color, size }: { color: string; size: number }) => item ? <AppIcon name={item.icon} size={size} color={color} /> : null,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: { fontFamily: fonts.mono, fontSize: 10 },
      tabBarStyle: useNativeTabs ? undefined : desktop
        ? { height: 0, backgroundColor: 'transparent', borderTopWidth: 0 }
        : { height: 64 + insets.bottom, backgroundColor: 'transparent', borderTopWidth: 0 },
      tabBarHideOnKeyboard: useNativeTabs ? undefined : true,
    };
  };
  return <Tab.Navigator initialRouteName="resumes" screenOptions={tabBarOptions} {...(!useNativeTabs ? { tabBar: footer } : {})} screenListeners={({ route }: { route: { name: keyof FooterTabParamList } }) => ({ tabPress: (event: { preventDefault: () => void }) => { Keyboard.dismiss(); if (route.name === 'resumes') setResumeSelectionRequest(value => value + 1); if ((route.name === 'dashboard' && !renderDashboard) || (route.name === 'pipeline' && !renderPipeline) || (route.name === 'settings' && !renderSettings)) { event.preventDefault(); onNavigateOutside(route.name); } } })}>
    <Tab.Screen name="dashboard">{({ navigation }: any) => renderDashboard ? <ResponsiveScene sidebarCollapsed={sidebarCollapsed}><SuppressNestedFooters>{renderDashboard({ onNavigate: destination => { if ((destination === 'pipeline' && !renderPipeline) || (destination === 'settings' && !renderSettings)) onNavigateOutside(destination); else navigation.navigate(destination); }, openSettings: destination => { if (renderSettings && renderSettingsDetail) navigation.navigate('settings', { screen: 'SettingsDetail', params: { destination }, initial: false }); else onNavigateOutside(destination); } })}</SuppressNestedFooters></ResponsiveScene> : null}</Tab.Screen>
    <Tab.Screen name="resumes">{({ navigation: tabNavigation }: any) => <ResponsiveScene sidebarCollapsed={sidebarCollapsed}><SuppressNestedFooters><LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="Library">{() => {
        const editor = activeEditor && renderEditor ? renderEditor({ ...activeEditor, desktopSplit: desktop, onBack: () => setActiveEditor(null), onNavigate: destination => { if (destination === 'resumes') setActiveEditor(null); else if (destination === 'pipeline' && renderPipeline) { setActiveEditor(null); tabNavigation.navigate('pipeline'); } else onNavigateOutside(destination); } }) : null;
        return <>{(!desktop || !activeEditor) && <ResumeLibraryScreen resumes={renderEditor ? { ...resumes, onOpen: id => setActiveEditor({ resumeId: id, initialMode: 'code' }), onEdit: id => setActiveEditor({ resumeId: id, initialMode: 'form' }), onPreview: id => setActiveEditor({ resumeId: id, initialMode: 'preview' }) } : resumes} templates={templates} onNavigateOutside={onNavigateOutside} initialView={initialRouteName === 'Templates' ? 'templates' : 'resumes'} resumeSelectionRequest={resumeSelectionRequest} />}{desktop && activeEditor && editor}{!desktop && renderEditor && <BottomSheet visible={!!activeEditor} title="Resume workspace" closeLabel="Close resume workspace" height="96%" onClose={() => setActiveEditor(null)}>{editor}</BottomSheet>}</>;
      }}</LibraryStack.Screen>
    </LibraryStack.Navigator></SuppressNestedFooters></ResponsiveScene>}</Tab.Screen>
    <Tab.Screen name="pipeline">{({ navigation }: any) => renderPipeline ? <ResponsiveScene sidebarCollapsed={sidebarCollapsed}><SuppressNestedFooters>{renderPipeline!({ onNavigate: destination => { if (destination === 'resumes') navigation.navigate('resumes'); else if (destination !== 'pipeline') onNavigateOutside(destination); } })}</SuppressNestedFooters></ResponsiveScene> : null}</Tab.Screen>
    <Tab.Screen name="preparation">{() => <ResponsiveScene sidebarCollapsed={sidebarCollapsed}><SuppressNestedFooters><PreparationScreen /></SuppressNestedFooters></ResponsiveScene>}</Tab.Screen>
      <Tab.Screen name="settings">
        {({ navigation }: any) => renderSettings ? (
          <ResponsiveScene sidebarCollapsed={sidebarCollapsed}>
            <SuppressNestedFooters>
              <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
                <SettingsStack.Screen name="SettingsHome">
                  {({ navigation }) => renderSettings({
                    openSettings: destination => {
                      if (renderSettingsDetail) navigation.navigate('SettingsDetail', { destination });
                      else onNavigateOutside(destination);
                    },
                    onSignOut,
                  })}
                </SettingsStack.Screen>
                {renderSettingsDetail && (
                  <SettingsStack.Screen name="SettingsDetail">
                    {({ route, navigation }) => renderSettingsDetail({
                      destination: route.params.destination,
                      onBack: () => navigation.goBack(),
                    })}
                  </SettingsStack.Screen>
                )}
              </SettingsStack.Navigator>
            </SuppressNestedFooters>
          </ResponsiveScene>
        ) : null}
      </Tab.Screen>
  </Tab.Navigator>;
}
