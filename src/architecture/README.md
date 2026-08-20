# Learnly application architecture

Learnly is a self-hosted React application with a Node HTTP API and SQLite persistence. Authentication, passwords, sessions, role checks, lesson access, chat, notices, and uploaded asset access are enforced by the server.

## Planned boundary

- **Client UI**: React screens, offline-readable learning packages, and the student's visible security page.
- **Domain**: portable TypeScript models for users, learning content, sessions, and security events.
- **Ports**: repository and authentication interfaces. A database adapter can implement these without changing the UI/domain model.
- **Backend enforcement**: authentication, password hashing, session validation, admin actions, and row-level/role-based permission checks belong on the server and database—not in the browser.

## Deployment storage

SQLite (`LEARNLY_DATABASE_PATH`, default `data/learnly.sqlite`) and lesson uploads (`LEARNLY_UPLOAD_DIR`, default `data/uploads`) must both be on persistent writable disk. Do not deploy them to an ephemeral filesystem. Back up the SQLite database using the supplied backup command and include the uploads directory in normal backups.

Upload limits are configurable with `LEARNLY_VIDEO_MAX_BYTES`, `LEARNLY_NOTES_MAX_BYTES`, and `LEARNLY_MATERIAL_MAX_BYTES`. The server generates stored filenames, validates allowlisted extensions and MIME/signature checks, and serves assets only through authenticated lesson-access routes.

## Privacy and security

Device/session records are restricted to account security. The model excludes precise location; any optional broad region is visible to the affected user. Admin session revocation, access changes, failed-login records, and audit logs must be implemented in backend/database policy, not as client-side UI hiding.
