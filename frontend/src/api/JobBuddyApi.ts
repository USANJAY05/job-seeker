import { ApiClient } from './ApiClient';
import type { QueryParams } from './types';
import type { ResumeListItem } from '../screens/MyResumesScreen';
import type { TemplateListItem } from '../screens/TemplatesExplorerScreen';
import type { OperatorProfile } from '../screens/OperatorProfileScreen';

export type CreateResumeInput = Omit<ResumeListItem, 'id'> & { id?: string };
export type ResumeUpdate = Partial<CreateResumeInput>;
export type CreateTemplateInput = Omit<TemplateListItem, 'id' | 'source'> & { id?: string; source: string };
export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';
export type AdminUser = { id: string; email: string; role: AdminRole; permissions: string[]; isActive: boolean };
export type AdminRoleInfo = { name: AdminRole; permissions: string[] };
export type AdminLoginResponse = { accessToken: string; tokenType: 'bearer'; expiresIn: number; user: AdminUser };
export type AdminUserInput = { email: string; password: string; role: AdminRole; permissions?: string[] | null };
export type AdminRoleUpdate = { role: AdminRole; permissions?: string[] | null; isActive?: boolean };

const objectResponse = <T>(value: unknown): T => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Expected an object response');
  return value as T;
};
const arrayResponse = <T>(value: unknown): T[] => {
  if (!Array.isArray(value)) throw new TypeError('Expected an array response');
  return value as T[];
};

/** Typed API adapter for the resume, template, and operator profile endpoints. */
export class JobBuddyApi {
  constructor(private readonly client: ApiClient) {}

  listResumes(query?: QueryParams) {
    return this.client.request<ResumeListItem[]>({ path: 'api/resumes', query, decode: arrayResponse<ResumeListItem> });
  }
  getResume(id: string) {
    return this.client.request<ResumeListItem>({ path: `api/resumes/${encodeURIComponent(id)}`, decode: objectResponse<ResumeListItem> });
  }
  createResume(input: CreateResumeInput) {
    return this.client.request<ResumeListItem>({ path: 'api/resumes', method: 'POST', body: input, decode: objectResponse<ResumeListItem> });
  }
  updateResume(id: string, input: ResumeUpdate) {
    return this.client.request<ResumeListItem>({ path: `api/resumes/${encodeURIComponent(id)}`, method: 'PATCH', body: input, decode: objectResponse<ResumeListItem> });
  }
  deleteResume(id: string) {
    return this.client.request<ResumeListItem>({ path: `api/resumes/${encodeURIComponent(id)}`, method: 'DELETE', decode: objectResponse<ResumeListItem> });
  }
  duplicateResume(id: string) {
    return this.client.request<ResumeListItem>({ path: `api/resumes/${encodeURIComponent(id)}/duplicate`, method: 'POST', decode: objectResponse<ResumeListItem> });
  }
  downloadResume(id: string, format = 'pdf') {
    return this.client.request<Blob>({ path: `api/resumes/${encodeURIComponent(id)}/download`, query: { format }, responseType: 'blob' });
  }

  listTemplates(query?: QueryParams) {
    return this.client.request<TemplateListItem[]>({ path: 'api/templates', query, decode: arrayResponse<TemplateListItem> });
  }
  createTemplate(input: CreateTemplateInput, accessToken: string) {
    return this.client.request<TemplateListItem>({ path: 'api/admin/templates', method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: input, decode: objectResponse<TemplateListItem> });
  }
  adminLogin(email: string, password: string) {
    return this.client.request<AdminLoginResponse>({ path: 'api/admin/auth/login', method: 'POST', body: { email, password }, decode: objectResponse<AdminLoginResponse> });
  }
  changeAdminPassword(currentPassword: string, newPassword: string, accessToken: string) {
    return this.client.request<void>({ path: 'api/admin/auth/change-password', method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: { currentPassword, newPassword } });
  }
  getAdminMe(accessToken: string) {
    return this.client.request<AdminUser>({ path: 'api/admin/me', headers: { Authorization: `Bearer ${accessToken}` }, decode: objectResponse<AdminUser> });
  }
  getAdminPermissions(accessToken: string) {
    return this.client.request<{ role: AdminRole; permissions: string[] }>({ path: 'api/admin/me/permissions', headers: { Authorization: `Bearer ${accessToken}` }, decode: objectResponse<{ role: AdminRole; permissions: string[] }> });
  }
  getAdminRoles(accessToken: string) {
    return this.client.request<AdminRoleInfo[]>({ path: 'api/admin/roles', headers: { Authorization: `Bearer ${accessToken}` }, decode: arrayResponse<AdminRoleInfo> });
  }
  listAdminUsers(accessToken: string) {
    return this.client.request<AdminUser[]>({ path: 'api/admin/users', headers: { Authorization: `Bearer ${accessToken}` }, decode: arrayResponse<AdminUser> });
  }
  createAdminUser(input: AdminUserInput, accessToken: string) {
    return this.client.request<AdminUser>({ path: 'api/admin/users', method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: input, decode: objectResponse<AdminUser> });
  }
  updateAdminUserRole(userId: string, input: AdminRoleUpdate, accessToken: string) {
    return this.client.request<AdminUser>({ path: `api/admin/users/${encodeURIComponent(userId)}/role`, method: 'PATCH', headers: { Authorization: `Bearer ${accessToken}` }, body: input, decode: objectResponse<AdminUser> });
  }
  listAdminTemplates(accessToken: string) {
    return this.client.request<TemplateListItem[]>({ path: 'api/admin/templates', headers: { Authorization: `Bearer ${accessToken}` }, decode: arrayResponse<TemplateListItem> });
  }
  getTemplate(id: string) {
    return this.client.request<TemplateListItem>({ path: `api/templates/${encodeURIComponent(id)}`, decode: objectResponse<TemplateListItem> });
  }
  getTemplateSource(id: string) {
    return this.client.request<string>({ path: `api/templates/${encodeURIComponent(id)}/source`, responseType: 'text' });
  }
  setTemplateBookmarked(id: string, bookmarked: boolean) {
    return this.client.request<TemplateListItem>({ path: `api/templates/${encodeURIComponent(id)}`, method: 'PATCH', body: { bookmarked }, decode: objectResponse<TemplateListItem> });
  }
  forkTemplate(id: string) {
    return this.client.request<ResumeListItem>({ path: `api/templates/${encodeURIComponent(id)}/fork`, method: 'POST', decode: objectResponse<ResumeListItem> });
  }

  getProfile() {
    return this.client.request<OperatorProfile>({ path: 'api/profile', decode: objectResponse<OperatorProfile> });
  }
  updateProfile(profile: OperatorProfile) {
    return this.client.request<OperatorProfile>({ path: 'api/profile', method: 'PUT', body: profile, decode: objectResponse<OperatorProfile> });
  }
}
