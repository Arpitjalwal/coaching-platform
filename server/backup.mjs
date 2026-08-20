import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { db, databasePath } from './db.mjs'

const output = resolve(process.argv[2] || `backups/learnly-${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`)
mkdirSync(resolve(output, '..'), { recursive: true })
const quotedPath = output.replace(/'/g, "''")
db.exec(`VACUUM INTO '${quotedPath}'`)
console.log(`Portable SQLite backup created: ${output}\nSource: ${databasePath}`)
