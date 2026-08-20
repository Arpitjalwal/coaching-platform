/** Opaque IDs keep storage implementation choices out of the UI and domain. */
export type Id = string
export type IsoDateTime = string

export type ClassLevel = 8 | 9 | 10
export type SubjectCode = 'mathematics' | 'science' | 'english' | 'sst'

export type AccessState = 'active' | 'denied' | 'disabled'

export type PageResult<T> = {
  items: T[]
  nextCursor?: string
}
