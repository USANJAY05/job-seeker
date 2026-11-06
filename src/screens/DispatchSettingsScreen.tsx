import React, { useState } from 'react';
import { SmallButton } from '../components/core';
import { NumberStepper, ProgressMeter, RangeControl, SettingsSection, SettingsToggle } from '../components/patterns/Settings';
import { SettingsScreenShell, SettingsText, type SettingsScreenProps } from './SettingsScreenShell';

export type DispatchSettingsInitial = { master: boolean; limit: number; cadence: boolean; fingerprint: boolean; gate: boolean; threshold: number; macro: boolean };
export function DispatchSettingsScreen({ onBack, onAction, initial }: SettingsScreenProps & { initial?: DispatchSettingsInitial }) {
  const [master, setMaster] = useState(initial?.master ?? false); const [limit, setLimit] = useState(initial?.limit ?? 1); const [cadence, setCadence] = useState(initial?.cadence ?? false); const [fingerprint, setFingerprint] = useState(initial?.fingerprint ?? false); const [gate, setGate] = useState(initial?.gate ?? false); const [threshold, setThreshold] = useState(initial?.threshold ?? 150); const [macro, setMacro] = useState(initial?.macro ?? false); const [portals, setPortals] = useState<Record<string, boolean>>({});
  const routes = ['Greenhouse ATS API', 'Workday Direct', 'Ashby & Lever Webhooks', 'Cold Recruiter Outreach'];
  return <SettingsScreenShell title="Autonomous Dispatch" subtitle="Pipeline controls" onBack={onBack} headerAction={<SmallButton label="Save" icon="content-save-outline" variant="primary" onPress={() => onAction('Save dispatch configuration')} />}>
    <SettingsSection title="Master Pipeline Switch" icon="power" badge="Not connected"><SettingsToggle title="Enable autonomous dispatch" description="Preview setting only; no dispatches are active." value={master} onValueChange={setMaster} /></SettingsSection>
    <SettingsSection title="Daily Dispatch Velocity" icon="speedometer"><ProgressMeter label="Today's Consumption" value={0} maximum={limit} detail="No live data" /><NumberStepper label="Daily Application Ceiling" value={limit} min={1} max={100} onChange={setLimit} /><SettingsText>Rate limits can be configured when dispatch is connected.</SettingsText></SettingsSection>
    <SettingsSection title="Cadence Parameters" icon="shield-outline"><SettingsToggle title="Cadence Randomizer" description="Configure timing for dispatches." value={cadence} onValueChange={setCadence} /><SettingsToggle title="Fingerprint Masquerading" description="Preview setting; no browser activity is performed." value={fingerprint} onValueChange={setFingerprint} /></SettingsSection>
    <SettingsSection title="Value & Approval Gates" icon="gavel"><SettingsToggle title="High-Value Approval Gate" description="Hold dispatches above the threshold for review." value={gate} onValueChange={setGate} /><RangeControl label="Minimum Intercept Threshold" value={threshold} min={150} max={500} step={25} onChange={setThreshold} detail={`$${threshold}k+`} /><SettingsToggle title="TeX Macro Injection" description="Preview a one-page resume setting." value={macro} onValueChange={setMacro} /></SettingsSection>
    <SettingsSection title="Target Portals Routing" icon="lan">{routes.map(route => <SettingsToggle key={route} title={route} value={!!portals[route]} onValueChange={value => setPortals(old => ({ ...old, [route]: value }))} />)}</SettingsSection>
    <SettingsSection title="Emergency controls" icon="alert-outline"><SmallButton label="Emergency Halt All Queues" icon="stop-circle-outline" onPress={() => onAction('Emergency halt')} /></SettingsSection>
  </SettingsScreenShell>;
}
