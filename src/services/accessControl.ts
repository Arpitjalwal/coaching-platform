import type { Permission, Role } from '../domain/access'
import { hasPermission } from '../domain/access'
import type { AccessState } from '../domain/common'

export type AuthorizationDecision = { allowed: true } | { allowed: false; reason: 'access_denied' | 'permission_denied' }

/** UI helper only. The future API/database must make the authoritative decision. */
export function authorize(role: Role, accessState: AccessState, permission: Permission): AuthorizationDecision {
  if (accessState !== 'active') return { allowed: false, reason: 'access_denied' }
  return hasPermission(role, permission) ? { allowed: true } : { allowed: false, reason: 'permission_denied' }
}
