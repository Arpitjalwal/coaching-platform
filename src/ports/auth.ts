import type { Id } from '../domain/common'
import type { Session } from '../domain/security'
import type { UserProfile } from '../domain/users'

/** Raw secrets are transient request input only and must never be logged or persisted. */
export type LoginRequest = { email: string; password: string; deviceLabel: string }
export type RegistrationRequest = { email: string; password: string; displayName: string; role: 'student' | 'teacher'; classLevel?: 8 | 9 | 10 }
export type AuthResult = { user: UserProfile; session: Session }

export interface PasswordHasher {
  hash(plaintext: string): Promise<string>
  verify(plaintext: string, hash: string): Promise<boolean>
}

export interface AuthService {
  register(request: RegistrationRequest): Promise<AuthResult>
  login(request: LoginRequest): Promise<AuthResult>
  logout(sessionId: Id): Promise<void>
}
