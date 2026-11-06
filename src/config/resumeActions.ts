import type { CreateOption } from '../components/patterns/CreateResumeAction';

export const createOptions: CreateOption[] = [
  { id: 'blank', label: 'Blank TeX Document', description: 'Start with a minimal template', icon: 'file-document-outline' },
  { id: 'template', label: 'From Verified Template', description: 'Explore available layouts', icon: 'view-grid-outline' },
  { id: 'pdf', label: 'Reverse-Engineer PDF', description: 'Create a TeX source from a PDF', icon: 'file-upload-outline' },
];
