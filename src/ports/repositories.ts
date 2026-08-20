import type { Id, PageResult } from '../domain/common'
import type { AccessGrant } from '../domain/access'
import type { Chapter, Course, Lesson, LessonProgress, StudyResource } from '../domain/learning'
import type { SecurityEvent, Session } from '../domain/security'
import type { AccessChange, CredentialRecord, UserProfile } from '../domain/users'

/** Persistence contracts: implement these with a portable self-hosted database next. */
export interface UserRepository {
  findById(id: Id): Promise<UserProfile | null>
  findByEmail(email: string): Promise<UserProfile | null>
  save(user: UserProfile): Promise<void>
  setAccess(change: AccessChange): Promise<void>
  listByRole(role: UserProfile['role'], cursor?: string): Promise<PageResult<UserProfile>>
}

export interface CredentialRepository {
  findByUserId(userId: Id): Promise<CredentialRecord | null>
  save(record: CredentialRecord): Promise<void>
}

export interface SessionRepository {
  create(session: Session): Promise<void>
  findActiveByUser(userId: Id): Promise<Session[]>
  revoke(sessionId: Id, revokedBy: Id, reason: NonNullable<Session['revokeReason']>): Promise<void>
  revokeAllForUser(userId: Id, revokedBy: Id, reason: 'admin_revoke_all' | 'security_response'): Promise<number>
}

export interface SecurityEventRepository {
  append(event: SecurityEvent): Promise<void>
  listForUser(userId: Id, cursor?: string): Promise<PageResult<SecurityEvent>>
}

export interface LearningRepository {
  listCourses(): Promise<Course[]>
  listChapters(courseId: Id): Promise<Chapter[]>
  listLessons(chapterId: Id): Promise<Lesson[]>
  listResources(lessonId: Id): Promise<StudyResource[]>
  getProgress(userId: Id, lessonId: Id): Promise<LessonProgress | null>
  saveProgress(progress: LessonProgress): Promise<void>
}

export interface AccessGrantRepository { listForUser(userId: Id): Promise<AccessGrant[]> }
