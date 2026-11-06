import type { ConversationMessage } from '../screens/ConversationScreen';
import type { DiffLine } from '../components/patterns/Conversation';

export const demoMessages: Record<string, ConversationMessage[]> = {
  'sample-anthropic': [
    { id: 'm1', kind: 'message', sender: 'Operator', time: '10:14 AM · example', side: 'right', text: 'Ingest this senior posting: Staff ML Inference Lead at Anthropic. Focus on vLLM, continuous batching, and KV-cache compression.', attachment: 'anthropic_ml_inf_lead.json · 3.4 KB' },
    { id: 'm2', kind: 'result', sender: 'Daemon Ingestion Agent', subtitle: 'Illustration only · no model is connected', summary: 'Staff ML Inference Lead · Anthropic\nSan Francisco, CA (Hybrid)\n$285,000 – $360,000 + Equity\n\nExample resume: Alex_Vance_ML_Inf_2025.tex', badges: ['Example ATS match: 98.2%', '+vLLM PagedAttention', '+KV-Cache Quantization', '+Triton Kernels'], actions: [{ id: 'diff', label: 'Review TeX Diff', icon: 'file-compare', variant: 'lightPrimary' }, { id: 'dispatch', label: 'Dispatch via Webhook', icon: 'webhook' }, { id: 'cover-letter', label: 'Tailor Cover Letter', icon: 'file-edit-outline' }] },
    { id: 'm3', kind: 'message', sender: 'Operator', time: '10:15 AM · example', side: 'right', text: 'Ensure the 1-page XeLaTeX clamp is respected.' },
    { id: 'm4', kind: 'message', sender: 'Example assistant', time: 'Example', text: 'This illustration shows where a compile confirmation would appear. No compilation has been performed.' },
  ],
  'sample-openai': [{ id: 'm1', kind: 'message', sender: 'Example assistant', text: 'This is an example conversation. No assistant service is connected.' }],
  'sample-stripe': [{ id: 'm1', kind: 'message', sender: 'Example assistant', text: 'This is an example conversation. No assistant service is connected.' }],
};

export const demoDiff: DiffLine[] = [{ id: 'old', kind: 'removed', text: String.raw`\item Previous example bullet.` }, { id: 'new', kind: 'added', text: String.raw`\item Updated example bullet.` }];
