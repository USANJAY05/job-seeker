import React, { useState } from 'react';
import { SmallButton } from '../components/core';
import { MetricCard, StatusCard } from '../components/patterns/Dashboard';
import { SettingsSection, SettingsToggle } from '../components/patterns/Settings';
import { SettingsGrid, SettingsScreenShell, SettingsText, type SettingsScreenProps } from './SettingsScreenShell';

export type FleetAgent = { id: string; title: string; description: string; icon: string; option: string };
export function AgentFleetScreen({ onBack, onAction, agents = [] }: SettingsScreenProps & { agents?: FleetAgent[] }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({}); const [options, setOptions] = useState<Record<string, boolean>>({});
  return <SettingsScreenShell title="Agent Fleet Control" subtitle="Agent configuration" onBack={onBack}>
    <SettingsGrid><MetricCard metric={{ label: '24h Dispatches', value: '—', icon: 'lightning-bolt-outline' }} /><MetricCard metric={{ label: 'Avg Latency', value: '—', icon: 'speedometer' }} /><MetricCard metric={{ label: 'Guard Score', value: '—', icon: 'shield-check-outline' }} /><MetricCard metric={{ label: 'KV-Cache', value: '—', icon: 'memory' }} /></SettingsGrid>
    <SettingsSection title="Active Daemons" subtitle="Configure individual agents" badge={`${agents.length} agents`}><SettingsText>{agents.length ? 'Agent switches are local preview controls; no agents are running.' : 'No agents available.'}</SettingsText></SettingsSection>
    {agents.map(agent => <SettingsSection key={agent.id} title={agent.title} subtitle={agent.description} icon={agent.icon}><SettingsToggle title={`Enable ${agent.title}`} value={!!enabled[agent.id]} onValueChange={value => setEnabled(old => ({ ...old, [agent.id]: value }))} /><SettingsToggle title={agent.option} value={!!options[agent.id]} onValueChange={value => setOptions(old => ({ ...old, [agent.id]: value }))} /></SettingsSection>)}
    <SettingsSection title="LLM Gateway Routing" icon="routes"><StatusCard title="Complex reasoning" description="Model selection will be available when connected" /><StatusCard title="Fast parsing" description="Model selection will be available when connected" /><SmallButton label="View Cluster Event Stream" icon="console" onPress={() => onAction('Cluster event stream')} /><SmallButton label="Halt Fleet" icon="power" onPress={() => onAction('Halt fleet')} /></SettingsSection>
  </SettingsScreenShell>;
}
