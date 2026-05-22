# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Grok CLI Vertex is a single-package TypeScript CLI tool built with Bun. It is a
Vertex AI-focused Grok coding-agent fork with an inherited native xAI fallback.
See `README.md` and `docs/` for user-facing and maintainer documentation.

### Quick reference


| Action        | Command                                                               |
| ------------- | --------------------------------------------------------------------- |
| Install deps  | `bun install` (installs Husky; pre-commit runs Biome on staged files) |
| Typecheck     | `bun run typecheck`                                                   |
| Build         | `bun run build`                                                       |
| Run built CLI | `./dist/index.js`                                                     |
| Headless mode | `./dist/index.js --prompt "..." --max-tool-rounds N`                  |
| CLI help      | `./dist/index.js --help`                                              |


### Known issues

- The full Vitest suite is not yet a required CI gate. Use targeted tests for
  touched behavior and keep `bun run typecheck` plus CI checks as the baseline
  merge gate until the full-suite failures are resolved.
- Vertex mode does not support inherited xAI-only capabilities such as batch,
  hosted search, media generation, and Telegram STT. These should fail through
  typed provider capability errors.

### Environment

- **Bun** must be installed for local development.
- Vertex mode requires Google Application Default Credentials plus
  `GROK_VERTEX_PROJECT_ID` or `GCP_PROJECT_ID`.
- `GROK_API_KEY` is required only for the inherited native xAI fallback and
  xAI-only features.
