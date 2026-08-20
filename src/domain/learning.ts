import type { ClassLevel, Id, IsoDateTime, SubjectCode } from './common'

export type Course = {
  id: Id
  title: string
  subject: SubjectCode
  classLevels: ClassLevel[]
  description: string
  teacherIds: Id[]
  published: boolean
}

export type Chapter = { id: Id; courseId: Id; title: string; description: string; position: number }

export type Lesson = {
  id: Id
  chapterId: Id
  title: string
  description: string
  position: number
  estimatedMinutes?: number
}

/** A resource can point to a local/offline package as well as a future hosted copy. */
export type StudyResource = {
  id: Id
  lessonId: Id
  kind: 'video' | 'notes' | 'worksheet' | 'link'
  title: string
  contentUri?: string
  offlinePackageId?: string
  downloadable: boolean
  checksum?: string
}

export type LessonProgress = {
  userId: Id
  lessonId: Id
  status: 'not_started' | 'in_progress' | 'completed'
  lastPositionSeconds?: number
  updatedAt: IsoDateTime
}
