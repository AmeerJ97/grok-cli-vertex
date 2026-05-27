# Contributing

Thanks for helping improve `grok-cli-vertex`. This fork is Vertex-first, with
the inherited native xAI path kept for compatibility and comparison.

## Project Direction

- Prefer Vertex AI behavior unless a change is explicitly about the native xAI
  fallback or upstream compatibility.
- Keep backend-specific behavior behind `src/providers/` and the
  `GrokProviderAdapter` contract.
- Use typed capability errors for unsupported provider features instead of
  letting unsupported endpoints fail late.
- Keep public docs honest that this project is community-built and is not an
  official xAI or Google product.

## Local Setup

```bash
bun install
bun run typecheck
bun run test
bun run build
```

For changes that touch runtime behavior, also run the narrow test file while
iterating:

```bash
bunx --bun vitest run path/to/file.test.ts
```

Vertex mode requires Google Application Default Credentials and a project id:

```bash
gcloud auth application-default login
GROK_PROVIDER=vertex GROK_VERTEX_PROJECT_ID=my-gcp-project bun run dev
```

Native xAI fallback testing still requires `GROK_API_KEY`.

## Pull Requests

- Start from current `main`.
- Keep PRs focused and avoid mixing code, docs, dependency, and release changes
  unless they are part of one behavior change.
- Include the commands you actually ran in the PR body.
- Add or update tests for provider behavior, storage migrations, tool loops,
  CLI flags, and user-visible error handling.
- Update README, CLI help, or docs when behavior changes.
- Call out any provider-specific risk, especially when changing shared agent or
  UI code that can affect both Vertex and native xAI modes.

## Issue Triage

Useful reports include:

- OS and terminal emulator
- Bun version
- Provider mode (`vertex` or `xai`)
- Relevant non-secret environment variables
- Reproduction steps and logs

Do not include API keys, Google Cloud project secrets, Telegram tokens, session
transcripts, or private repository data in public issues.

## Branch Hygiene

Merged PR branches are normally deleted on GitHub. Local branches may remain as
private working references, but new public polish or maintenance work should use
a fresh branch from current `main`.
