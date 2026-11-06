import type { RetentionPolicyInitial } from '../screens/RetentionPolicyScreen';
export const demoRetentionPolicy: RetentionPolicyInitial = { jobData: '30d', versions: '10', logs: '30d', outreach: 'archive', flags: { payloads: false, anonymize: false, cache: false, master: true, traces: false, keys: false } };
