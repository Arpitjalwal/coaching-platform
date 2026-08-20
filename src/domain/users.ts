import type { AccessState, ClassLevel, Id, IsoDateTime, SubjectCode } from './common'
import type { Role } from './access'

export type Account = {
  id: Id
  role: Role
  email: string
  displayName: string
  accessState: AccessState
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export type StudentProfile = Account & {
  role: 'student'
  classLevel: ClassLevel
  guardianContact?: string
}

export type TeacherProfile = Account & {
  role: 'teacher'
  subjects: SubjectCode[]
  bio?: string
}

export type AdminProfile = Account & { role: 'admin' }
export type UserProfile = StudentProfile | TeacherProfile | AdminProfile

/** Password hashes only. A plaintext password must never be persisted or returned. */
export type CredentialRecord = {
  userId: Id
  passwordHash: string
  passwordChangedAt: IsoDateTime
}

export type AccessChange = {
  userId: Id
  previousState: AccessState
  nextState: AccessState
  reason?: string
  changedBy: Id
  changedAt: IsoDateTime
}
