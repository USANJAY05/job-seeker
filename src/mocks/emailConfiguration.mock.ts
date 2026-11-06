import type { EmailConfigurationInitial } from '../screens/EmailConfigurationScreen';
/** Contains no keys, passwords or personal information. */
export const demoEmailConfiguration: EmailConfigurationInitial = { outgoing: false, incoming: false, protocol: 'api', provider: 'resend', tls: true, invites: true, statuses: true };
