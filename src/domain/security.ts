import type { Id, IsoDateTime } from './common'

/** Only collect fields needed to identify and secure a session; do not collect precise location. */
export type DeviceSummary = {
  label: string
  browser?: string
  operatingSystem?: string
}

export type Session = {
  id: Id
  userId: Id
  device: DeviceSummary
  createdAt: IsoDateTime
  lastActiveAt: IsoDateTime
  expiresAt: IsoDateTime
  revokedAt?: IsoDateTime
  revokedBy?: Id
  revokeReason?: 'user_logout' | 'user_revoke' | 'admin_revoke_all' | 'security_response' | 'expired'
}

export type SecurityEventType = 'login_success' | 'login_failed' | 'logout' | 'session_revoked' | 'password_changed' | 'access_denied' | 'access_restored'

export type SecurityEvent = {
  id: Id
  userId?: Id
  type: SecurityEventType
  occurredAt: IsoDateTime
  sessionId?: Id
  device?: DeviceSummary
  /** Optional broad region is security-only, user-visible, and never precise GPS location. */
  approximateRegion?: string
  detail?: string
}

export const securityDataNotice = 'Learnly shows only security-relevant device and optional broad-region data. It does not collect precise location or use security data for tracking.'
