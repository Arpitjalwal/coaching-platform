import { mkdirSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { dirname, resolve } from 'node:path'

const databasePath = resolve(process.env.LEARNLY_DATABASE_PATH || 'data/learnly.sqlite')
mkdirSync(dirname(databasePath), { recursive: true })
export const db = new DatabaseSync(databasePath)
db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, role TEXT NOT NULL CHECK(role IN ('student','teacher','admin')),
    email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL, class_level INTEGER,
    access_state TEXT NOT NULL DEFAULT 'active' CHECK(access_state IN ('active','denied','disabled')),
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS credentials (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL, password_changed_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE, device_label TEXT NOT NULL, created_at TEXT NOT NULL,
    last_active_at TEXT NOT NULL, expires_at TEXT NOT NULL, revoked_at TEXT, revoked_by TEXT,
    revoke_reason TEXT
  );
  CREATE TABLE IF NOT EXISTS security_events (
    id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, occurred_at TEXT NOT NULL, session_id TEXT,
    device_label TEXT, detail TEXT
  );
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL, expires_at TEXT NOT NULL,
    used_at TEXT, initiated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL
  );
  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, subject TEXT NOT NULL,
    class_level INTEGER NOT NULL CHECK(class_level IN (8,9,10)), teacher_id TEXT REFERENCES users(id),
    description TEXT NOT NULL, published INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY, course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL, description TEXT NOT NULL, position INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY, chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL, description TEXT NOT NULL, video_label TEXT, notes_label TEXT,
    material_label TEXT, content TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft'
      CHECK(status IN ('draft','published')), position INTEGER NOT NULL, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS lesson_assignments (
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(lesson_id, student_id)
  );
  CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started', updated_at TEXT NOT NULL,
    PRIMARY KEY(user_id, lesson_id)
  );
  CREATE TABLE IF NOT EXISTS lesson_assets (
    id TEXT PRIMARY KEY, lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    uploader_id TEXT NOT NULL REFERENCES users(id), asset_type TEXT NOT NULL CHECK(asset_type IN ('video','notes','material')),
    original_filename TEXT NOT NULL, stored_filename TEXT NOT NULL UNIQUE, mime_type TEXT NOT NULL,
    size INTEGER NOT NULL, created_at TEXT NOT NULL, UNIQUE(lesson_id, asset_type)
  );
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_id TEXT REFERENCES users(id) ON DELETE SET NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(conversation_id, user_id)
  );
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES users(id), body TEXT NOT NULL, created_at TEXT NOT NULL, read_at TEXT
  );
  CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, target_class INTEGER CHECK(target_class IN (8,9,10)),
    created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_events_user ON security_events(user_id, occurred_at DESC);
  CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id, expires_at);
  CREATE INDEX IF NOT EXISTS idx_assets_lesson ON lesson_assets(lesson_id, asset_type);
  CREATE INDEX IF NOT EXISTS idx_conversations_student ON conversations(student_id, updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_notices_target ON notices(target_class, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role, email);
`)

// Lightweight migrations keep the single SQLite file portable across existing installs.
const lessonColumns = new Set(db.prepare('PRAGMA table_info(lessons)').all().map((column) => column.name))
if (!lessonColumns.has('content')) db.exec("ALTER TABLE lessons ADD COLUMN content TEXT NOT NULL DEFAULT ''")
if (!lessonColumns.has('status')) db.exec("ALTER TABLE lessons ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'")
if (!lessonColumns.has('video_url')) db.exec("ALTER TABLE lessons ADD COLUMN video_url TEXT NOT NULL DEFAULT ''")
if (!lessonColumns.has('notes_url')) db.exec("ALTER TABLE lessons ADD COLUMN notes_url TEXT NOT NULL DEFAULT ''")
if (!lessonColumns.has('material_url')) db.exec("ALTER TABLE lessons ADD COLUMN material_url TEXT NOT NULL DEFAULT ''")
const messageColumns = new Set(db.prepare('PRAGMA table_info(messages)').all().map((column) => column.name))
if (!messageColumns.has('delivered_at')) db.exec('ALTER TABLE messages ADD COLUMN delivered_at TEXT')
db.exec('CREATE INDEX IF NOT EXISTS idx_messages_delivery ON messages(conversation_id, delivered_at, read_at)')

export const now = () => new Date().toISOString()
export const id = () => crypto.randomUUID()
export const one = (sql, ...params) => db.prepare(sql).get(...params) ?? null
export const all = (sql, ...params) => db.prepare(sql).all(...params)
export const run = (sql, ...params) => db.prepare(sql).run(...params)
export const transaction = (work) => {
  db.exec('BEGIN IMMEDIATE')
  try {
    const result = work()
    db.exec('COMMIT')
    return result
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}
export { databasePath }
