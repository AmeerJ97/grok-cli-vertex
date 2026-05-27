# Maintainer Runbook

This runbook documents the routine checks and release hygiene for
`grok-cli-vertex`.

## Local Checks

Use the same commands as CI before merging code changes:

```bash
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run test
bun run build:binary
```

For changes touching runtime behavior, also run targeted tests:

```bash
bunx --bun vitest run path/to/file.test.ts
```

The full suite is required for merge:

```bash
bun run test
```

## Pull Request Checklist

Before marking a PR ready:

- Keep the diff focused and avoid unrelated generated changes.
- Include the commands that were actually run in the PR body.
- Update README, CLI help, or docs when user-facing behavior changes.
- Add or update targeted tests for provider, storage, tool, and migration
  behavior.
- Confirm Vertex-specific behavior uses provider capabilities instead of
  hardcoded backend checks in random call sites.
- Confirm xAI fallback behavior still works when compatibility code is touched.
- Confirm security-sensitive changes are routed through `SECURITY.md` guidance
  instead of public issue details.

## Merge Policy

The repository uses required status checks and required conversation resolution
on `main`. Maintainers can merge once:

- CI `verify` passes.
- `security-scan` passes.
- All review threads are resolved.
- Any known residual risk is stated in the PR.

Dependabot PRs can be merged when CI and security checks pass and the dependency
scope is clear.

## Public Repository Hygiene

For public maintenance branches, keep the public-facing project surfaces aligned:

- README links to architecture, roadmap, contributing, security, and the public
  repo audit.
- `package.json` includes repository, issue tracker, and homepage metadata.
- `SECURITY.md` points reporters to private vulnerability reporting.
- Merged PR branches may be pruned remotely; local branches with upstreams marked
  `gone` should not be deleted unless the maintainer confirms they are no
  longer useful.
- New polish or maintenance work should start from current `main` on one focused
  branch, not by replaying old local branches wholesale.

## Release Flow

Releases are produced by `.github/workflows/release.yml`.

1. Decide the next version and update package metadata if needed.
2. Create a tag in the format `grok-dev@x.y.z`.
3. Push the tag, or run the release workflow manually with the same tag.
4. Confirm Linux, macOS, and Windows artifacts are uploaded.
5. Confirm `checksums.txt` is present in the GitHub Release.

Release artifacts are standalone binaries built with Bun. The install script
should prefer release assets when available and should keep update/uninstall
behavior script-managed.

## Troubleshooting

If Vertex mode fails before the first request, check:

- `GROK_PROVIDER=vertex`
- `GROK_VERTEX_PROJECT_ID` or `GCP_PROJECT_ID`
- `gcloud auth application-default print-access-token`
- Vertex AI API enabled on the target Google Cloud project

If native xAI fallback fails, check:

- `GROK_API_KEY`
- `GROK_BASE_URL` only when intentionally overriding the default xAI host
- Whether the requested feature is xAI-only or Vertex-compatible

If CI fails in formatting or linting, prefer running the exact CI commands
locally rather than hand-editing generated output.
