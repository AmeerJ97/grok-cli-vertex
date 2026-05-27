# Public Repository Audit

Snapshot date: 2026-05-27

This audit records the public-repo polish pass that consolidated the old branch
state into a single maintenance branch: `chore/repo-polish-audit`.

## Current Remote State

- Repository: `AmeerJ97/grok-cli-vertex`
- Visibility: public
- Default branch: `main`
- Local `main`: clean and aligned with `origin/main` at `bbf4fef`
- Branch protection: enabled on `main`, requiring strict status checks for
  `verify` and `security-scan`; conversation resolution is required; force
  pushes and branch deletion are disabled.
- Repository topics: `bun`, `cli`, `coding-agent`, `google-cloud`, `grok`,
  `opentui`, `typescript`, and `vertex-ai`
- Homepage: `https://github.com/AmeerJ97/grok-cli-vertex#readme`
- Wiki: disabled so public documentation stays in version-controlled files
- Vulnerability alerts and private vulnerability reporting: enabled
- Active remote branches:
  - `origin/main`
  - `origin/dependabot/bun/bun-dependencies-e5bce18172`
- Open remote work:
  - PR #20, Dependabot Bun dependency group update, CI and security scan passing
- Current remote gaps before this branch lands: no GitHub-recognized security
  policy, no latest release, and no CodeQL/code-scanning analysis available.

## Old Branch Assessment

GitHub PR history shows the old issue/fix/docs branches were merged or closed.
After `git fetch --prune origin`, their remote-tracking refs were removed, but
local branches remain as private references with upstreams marked `gone`.

Do not replay those local branches wholesale. They are historical working
branches whose public PR outcomes are already represented by merged history on
`main` or by closed Dependabot state.

Recommended handling:

- Keep them untouched until the maintainer confirms whether any local-only
  context is still useful.
- Delete local branches only after confirming they are no longer needed.
- Use fresh branches from `main` for new public polish, maintenance, or release
  work.

## Public Polish Findings

Completed in this branch:

- Added `CONTRIBUTING.md` so new contributors can find setup, provider-boundary,
  PR, and issue-triage expectations.
- Added `SECURITY.md` so GitHub can surface a security policy and reporters have
  a private disclosure path.
- Added package metadata for repository, issue tracker, and homepage links.
- Linked contributing, security, and this audit from the README and maintainer
  runbook.
- Tightened GitHub templates so blank issues are disabled and the PR checklist
  matches the CI gate more closely.
- Updated GitHub repository metadata: homepage, topics, wiki setting,
  vulnerability alerts, and private vulnerability reporting.

Recommended GitHub follow-ups after this branch lands:

- Consider adding CodeQL or another code-scanning workflow if the project needs
  GitHub-native security alerting beyond the current secret scan.
- Keep delete-branch-on-merge enabled.
- Publish a release when install-script release assets are ready; no latest
  release currently exists.

## Verification

Run before merging:

```bash
bun run format
bun run lint
bun run typecheck
bun run test
bun run build
```
