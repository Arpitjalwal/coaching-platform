import type { Id, IsoDateTime } from './common'

export const roles = ['student', 'teacher', 'admin'] as const
export type Role = (typeof roles)[number]

export const permissions = [
  'profile.read:self',
  'profile.update:self',
  'learning.read',
  'progress.read:self',
  'progress.update:self',
  'chat.read:own',
  'chat.write',
  'course.manage:assigned',
  'student.progress.read:assigned',
  'student.manage',
  'teacher.manage',
  'access.manage',
  'session.revoke:any',
  'security.audit.read',
  'role.manage',
] as const

export type Permission = (typeof permissions)[number]

/**
 * This is a shared policy catalogue, not the source of enforcement. The future
 * API/database must enforce the same permissions with row-level policies.
 */
export const rolePermissions: Readonly<Record<Role, readonly Permission[]>> = {
  student: ['profile.read:self', 'profile.update:self', 'learning.read', 'progress.read:self', 'progress.update:self', 'chat.read:own', 'chat.write'],
  teacher: ['profile.read:self', 'profile.update:self', 'learning.read', 'chat.read:own', 'chat.write', 'course.manage:assigned', 'student.progress.read:assigned'],
  admin: ['profile.read:self', 'profile.update:self', 'learning.read', 'chat.read:own', 'chat.write', 'student.manage', 'teacher.manage', 'access.manage', 'session.revoke:any', 'security.audit.read', 'role.manage'],
}

export type AccessGrant = {
  id: Id
  userId: Id
  role: Role
  grantedAt: IsoDateTime
  grantedBy?: Id
}

export const hasPermission = (role: Role, permission: Permission): boolean => rolePermissions[role].includes(permission)
