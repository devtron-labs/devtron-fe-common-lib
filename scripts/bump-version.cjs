#!/usr/bin/env node

/**
 * bump-version.js
 *
 * 📦 A CLI script to auto-bump package version based on Git merge context.
 *
 * 🚀 What It Does:
 * 1. Reads the base version from the `origin/main` branch.
 * 2. Determines the new version based on merge type:
 *    - RC     → bump minor (e.g. 0.11.0 → 0.12.0)
 *    - Hotfix → bump patch (e.g. 0.11.0 → 0.11.1)
 *    - Feature→ append/increment `-pre-x` (e.g. 0.11.0 → 0.11.0-pre-0)
 *    - Task   → append/increment `-beta-x` (e.g. 0.11.0-pre-0 → 0.11.0-beta-0)
 * 3. Updates `package.json` and regenerates `package-lock.json` via `npm install`.
 * 4. Auto-commits the change.
 * 5. Pushes to the current branch.
 *
 * 🧠 Assumptions:
 * - You're authenticated with GitHub (e.g., via PAT in CI or `git` configured locally).
 *
 * 🧪 Usage:
 *   node bump-version.js rc       # Merging RC into main
 *   node bump-version.js hotfix   # Merging hotfix into main
 *   node bump-version.js feature  # Merging feature into develop
 *   node bump-version.js task     # Merging task into feature
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Parse and validate bump type
const bumpType = process.argv[2]
const validTypes = ['rc', 'hotfix', 'feature', 'task']

if (!validTypes.includes(bumpType)) {
    console.error(`❌ Usage: node bump-version.js <${validTypes.join('|')}>`)
    process.exit(1)
}

// Utils
function run(cmd) {
    try {
        return execSync(cmd, { stdio: 'inherit' })?.toString()?.trim()
    } catch {
        console.error(`❌ Failed: ${cmd}`)
        process.exit(1)
    }
}

function runSilent(cmd) {
    try {
        return execSync(cmd)?.toString()?.trim()
    } catch {
        return null
    }
}

// Parse version string into parts
function parseVersion(v) {
    const match = v.match(/^(\d+)\.(\d+)\.(\d+)(?:-(pre|beta)-(\d+))?$/)
    if (!match) return null
    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
        tag: match[4] || null,
        tagNum: match[5] ? Number(match[5]) : null,
    }
}

// Turn parts back into version string
function formatVersion({ major, minor, patch, tag, tagNum }) {
    let v = `${major}.${minor}.${patch}`
    if (tag) v += `-${tag}-${tagNum}`
    return v
}

// Bump logic based on merge context
function bump(versionObj, type, allVersions = []) {
    const { major, minor, patch } = versionObj
    const base = { major, minor, patch }

    if (type === 'rc') {
        return { ...base, minor: minor + 1, patch: 0 }
    }

    if (type === 'hotfix') {
        return { ...base, patch: patch + 1 }
    }

    // Handle pre and beta bumps by checking published versions
    const tag = type === 'feature' ? 'pre' : 'beta'
    const tagPrefix = `${major}.${minor}.${patch}-${tag}-`

    const related = allVersions
        .filter((v) => v.startsWith(tagPrefix))
        .map(parseVersion)
        .filter(Boolean)

    const maxTagNum = related.reduce((max, v) => {
        return v.tagNum != null ? Math.max(max, v.tagNum) : max
    }, -1)

    return { ...base, tag, tagNum: maxTagNum + 1 }
}

// 🔍 Step 1: Load current package.json
const pkgPath = path.resolve(__dirname, '../', 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

// 🔍 Step 2: Get base version from `origin/main`
console.log('🔍 Fetching base version...')
runSilent('git fetch origin main')
const mainPkgRaw = runSilent('git show origin/main:package.json')

if (!mainPkgRaw) {
    console.error('❌ Could not read package.json from origin/main')
    process.exit(1)
}

const mainVersion = JSON.parse(mainPkgRaw).version
const baseParsed = parseVersion(mainVersion)

if (!baseParsed) {
    console.error(`❌ Invalid version on main branch: ${mainVersion}`)
    process.exit(1)
}

console.log(`📦 Base version from main: ${mainVersion}`)

// 🔍 Step 3: (for pre/beta) fetch published versions from NPM
let allVersions = []
if (['feature', 'task'].includes(bumpType)) {
    try {
        console.log('🔍 Checking for published versions...')
        const result = runSilent(`npm view ${pkg.name} versions --json`)
        allVersions = JSON.parse(result || '[]')
    } catch {
        allVersions = []
    }
}

// 🎯 Step 4: Calculate the new version
const newVersionObj = bump(baseParsed, bumpType, allVersions)
const newVersion = formatVersion(newVersionObj)
pkg.version = newVersion

// 💾 Step 5: Update package.json with new version
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n')
console.log(`✅ Bumped version: ${mainVersion} → ${newVersion}`)

// 🔧 Step 6: Update package-lock.json
console.log('📦 Running npm install...')
run('npm install')

// ✅ Step 7: Commit changes
run('git config user.name "systemsdt"')
run('git config user.email "devops@devtron.ai"')
run('git add package.json package-lock.json')
const commitMsg = `chore(version): bump to ${newVersion}`
run(`git commit -m "${commitMsg}"`)

// 🚀 Step 8: Push changes to current branch
const currentBranch = runSilent('git rev-parse --abbrev-ref HEAD');
run(`git push origin ${currentBranch}`);

console.log(`🚀 Pushed version bump to origin/${currentBranch}`);
