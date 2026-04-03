#!/usr/bin/env npx tsx
/**
 * Generate a MapKit JS JWT token.
 * Usage: npx tsx scripts/generate-mapkit-token.ts
 *
 * Requires the .p8 private key file in the project root.
 * Output: a JWT token valid for 1 year.
 */
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const TEAM_ID = 'C7HGT5JX2Q'
const KEY_ID = 'G9TA5L35U2'

// Find .p8 file
const projectRoot = path.join(import.meta.dirname, '..')
const p8File = fs.readdirSync(projectRoot).find((f: string) => f.endsWith('.p8'))
if (!p8File) {
    console.error('No .p8 file found in project root')
    process.exit(1)
}

const privateKey = fs.readFileSync(path.join(projectRoot, p8File))

const token = jwt.sign({
    iss: TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365), // 1 year
}, privateKey, {
    algorithm: 'ES256',
    keyid: KEY_ID,
})

console.log('\nMapKit JS Token (set as NEXT_PUBLIC_MAPKIT_TOKEN):\n')
console.log(token)
console.log()
