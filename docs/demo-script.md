# Demo Script

Use this script for a short maintainer or recruiter-facing walkthrough. It is
designed to show the real project shape without requiring private credentials
on screen.

## Setup

```bash
bun install
bun run typecheck
bun run build
```

For Vertex mode, authenticate with Google Application Default Credentials and
set a project id:

```bash
gcloud auth application-default login
export GROK_PROVIDER=vertex
export GROK_VERTEX_PROJECT_ID=my-gcp-project
```

If you do not want to expose a real project id in a recording, show the config
shape instead:

```json
{
  "provider": "vertex",
  "vertex": {
    "projectId": "my-gcp-project",
    "location": "global"
  }
}
```

## Five-Minute Flow

1. Open with the README and state the project goal: a Vertex AI-focused Grok
   coding-agent fork with native xAI compatibility retained as fallback.
2. Show the provider boundary:

   ```bash
   sed -n '1,180p' src/providers/types.ts
   sed -n '1,180p' src/providers/vertex/index.ts
   ```

3. Show the CLI help and available workflows:

   ```bash
   bun run build
   ./dist/index.js --help
   ./dist/index.js models
   ```

4. Run a headless local prompt in a safe directory:

   ```bash
   ./dist/index.js --prompt "Summarize this repository in five bullets." --max-tool-rounds 3
   ```

5. Show structured output for automation:

   ```bash
   ./dist/index.js --prompt "List the top-level package scripts." --format json --max-tool-rounds 3
   ```

6. Demonstrate capability gating without making a live xAI batch call:

   ```bash
   GROK_PROVIDER=vertex ./dist/index.js --prompt "Say hello" --batch-api
   ```

   Expected behavior: Vertex mode should return a typed capability error for
   xAI batch rather than silently pretending the feature exists.

7. Close with the CI and security posture:

   ```bash
   ls .github/workflows
   sed -n '1,140p' .github/workflows/typecheck.yml
   sed -n '1,180p' .github/workflows/security.yml
   ```

## What To Emphasize

- The provider adapter is a real seam, not scattered `if vertex` checks.
- Unsupported Vertex features fail intentionally through typed capability
  errors.
- Headless JSONL output makes the CLI usable in scripts and review workflows.
- The repo has required CI, security scanning, Dependabot grouping, release
  binaries, and install/update/uninstall paths.
- The current full Vitest suite is not yet a required gate; be explicit about
  that if asked.
