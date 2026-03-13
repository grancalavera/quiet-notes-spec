# Using TypeScript with PocketBase Hooks

## Overview

PocketBase's `pb_hooks` system uses an embedded ES5 JavaScript engine (goja). While native TypeScript support is not included, you can compile TypeScript to JavaScript for use with hooks.

## Official Stance

PocketBase **will not add native TypeScript support** due to maintainability concerns ([Issue #5159](https://github.com/pocketbase/pocketbase/issues/5159)). However, they provide **type definitions** at `pb_data/types.d.ts` for IDE support and type checking.

## Solution: Compile TypeScript to JavaScript

The community has established working patterns using build tools to compile TypeScript hooks.

---

## Approach 1: Manual Setup with tsup + chokidar

Source: [Official walkthrough discussion](https://github.com/pocketbase/pocketbase/discussions/3341)

### File Structure

```
src/
  hooks/
    my-hook.pb.ts    # TypeScript source files
pb_hooks/            # Compiled JavaScript output
pb_data/
  types.d.ts         # PocketBase type definitions
```

### Setup Steps

**1. Reference PocketBase types in your hook files:**

```typescript
/// <reference path="../../pb_data/types.d.ts" />

onRecordAfterUpdateRequest((e) => {
  console.log(JSON.stringify(e.record))
}, 'users')
```

**2. Install build dependencies:**

```bash
yarn add -D chokidar tsup
# or
pnpm add -D chokidar tsup
```

**3. Add build scripts to `package.json`:**

```json
{
  "scripts": {
    "build:hooks": "tsup ./src/hooks/*.ts -d ./pb_hooks",
    "dev:hooks": "chokidar './src/hooks/**' -c 'yarn build:hooks' --initial"
  }
}
```

**4. Development workflow:**

```bash
# Watch mode - auto-recompiles on changes
yarn dev:hooks

# One-time build
yarn build:hooks
```

**5. Start PocketBase with compiled hooks:**

```bash
pocketbase serve --hooksDir=./pb_hooks
```

### Using Shared Libraries

Create a central library file with proper type support:

```typescript
// src/hooks/lib.ts
export function hello() {
  console.log("Hello from TypeScript!")
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

Use it in hooks with type assertions:

```typescript
/// <reference path="../../pb_data/types.d.ts" />

type Lib = typeof import('./lib')

onRecordAfterUpdateRequest((e) => {
  const lib = require(`${__hooks}/lib.js`) as Lib
  const { hello, validateEmail } = lib

  hello()
  if (validateEmail(e.record.get('email'))) {
    // ... validation logic
  }
}, 'users')
```

---

## Approach 2: Bun Template

Source: [pocketbase-typescript-hooks-template](https://github.com/9ecbf/pocketbase-typescript-hooks-template)

A ready-made template that uses Bun for fast compilation.

### Setup

```bash
# Clone or use as template
git clone https://github.com/9ecbf/pocketbase-typescript-hooks-template.git

# Install dependencies
bun install
```

### Create Hooks

Create `*.pb.ts` files in the `src/` directory:

```typescript
/// <reference path="../types/pocketbase.d.ts" />

onBootstrap((e) => {
  console.log("App started with TypeScript!")
  e.next()
})
```

### Build and Run

```bash
# Build only
bun run build

# Build + start PocketBase
bun dev

# Or manually start after build
pocketbase serve --dir=pb_data --hooksDir=pb_data/pb_hooks
```

---

## Important Limitations

PocketBase's JavaScript engine has significant constraints:

### 1. No Async/Await or Promises

The JSVM uses ES5 and does not support:
- `async`/`await`
- Promises
- `setTimeout` / `setInterval`

Use synchronous code and rely on PocketBase's concurrent thread execution instead.

### 2. No Node.js or Browser APIs

Not available:
- `window`, `document` (browser)
- `fs`, `path`, `buffer` (Node.js)
- `fetch`, `XMLHttpRequest`
- Any ES6+ features that require runtime support

### 3. CommonJS Only

```javascript
// ✅ Supported
const lib = require('./lib.js')

// ❌ Not supported
import { lib } from './lib.js'
```

### 4. Compiled Files Must Use `.pb.js` Extension

PocketBase only loads files matching `*.pb.js` in the hooks directory.

---

## Recommended Approach for quiet-notes

Given the project already uses **pnpm** and has a structured setup:

1. **Create TypeScript source directory:**
   ```
   pb_hooks_src/
     *.pb.ts
   ```

2. **Use tsup for compilation** (simple, fast, zero-config):
   ```bash
   pnpm add -D tsup chokidar
   ```

3. **Add build scripts:**
   ```json
   {
     "scripts": {
       "build:hooks": "tsup pb_hooks_src/*.ts --format cjs --out-dir pb_hooks",
       "watch:hooks": "chokidar 'pb_hooks_src/**' -c 'pnpm build:hooks' --initial"
     }
   }
   ```

4. **Development workflow:**
   - Run `pnpm watch:hooks` during development
   - PocketBase auto-reloads on file changes (UNIX only)

5. **Deployment decision:**
   - **Option A:** Commit compiled `.pb.js` files (simpler Docker builds)
   - **Option B:** Gitignore `pb_hooks/` and compile in Docker build step

---

## Example Hook with Types

```typescript
/// <reference path="../pb_data/types.d.ts" />

// Hook: Auto-update timestamps on note modifications
onRecordBeforeUpdateRequest((e) => {
  // e.record is fully typed
  e.record.set('updated', new Date().toISOString())
  e.next()
}, 'notes')

// Hook: Validate note content length
onRecordCreateRequest((e) => {
  const content = e.record.get('content') as string

  if (content.length > 10000) {
    throw new BadRequestError('Note content exceeds maximum length')
  }

  e.next()
}, 'notes')

// Custom route with typed response
routerAdd('GET', '/api/stats', (e) => {
  const noteCount = $app.findRecordsByFilter('notes', '', '-created', 1).length

  return e.json(200, {
    notes: noteCount,
    timestamp: new Date().toISOString()
  })
})
```

---

## Resources

- [PocketBase JavaScript Overview](https://pocketbase.io/docs/js-overview/)
- [PocketBase Event Hooks](https://pocketbase.io/docs/js-event-hooks/)
- [TypeScript with pb_hooks Walkthrough](https://github.com/pocketbase/pocketbase/discussions/3341)
- [PocketBase Types Reference](https://pocketbase.io/docs/js-types/)
- [TypeScript Hooks Template (Bun)](https://github.com/9ecbf/pocketbase-typescript-hooks-template)
- [TypeScript Support Proposal (Rejected)](https://github.com/pocketbase/pocketbase/issues/5159)

---

## Quick Reference: tsconfig.json

If using TypeScript for hooks, use a conservative configuration:

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "CommonJS",
    "lib": ["ES5"],
    "outDir": "./pb_hooks",
    "rootDir": "./pb_hooks_src",
    "strict": true,
    "esModuleInterop": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": []
  },
  "include": ["pb_hooks_src/**/*"],
  "exclude": ["node_modules", "pb_hooks"]
}
```

Note: This config is for reference only. When using `tsup`, it handles TypeScript compilation and you may not need a separate `tsconfig.json`.
