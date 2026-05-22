# Roadmap

This roadmap is intentionally pragmatic. It separates product direction from
repo hygiene so contributors can see what is important now versus later.

## Near Term

- Finish the Vertex provider hardening work: install/auth UX, typed capability
  errors, model routing, and clear project-id prompts.
- Keep the full Vitest suite stable as a required CI gate.
- Keep README and demo documentation aligned with the installed binary path,
  Vertex defaults, and native xAI fallback behavior.
- Add targeted regression tests whenever provider capabilities, session
  storage, migrations, or CLI flags change.

## Mid Term

- Expand Vertex auth options beyond local ADC if the CLI needs service account
  or pre-minted token workflows.
- Improve provider contract tests so xAI and Vertex behavior can be compared
  without live credentials.
- Make headless JSON output a stable integration contract with documented event
  schemas.
- Improve release automation around generated notes, install script validation,
  and artifact smoke tests.

## Non-Goals

- Do not present this fork as an official xAI or Google product.
- Do not add hosted services, databases, or background infrastructure unless a
  feature clearly requires them.
- Do not bypass provider capability gates to make unsupported Vertex features
  appear to work.
- Do not make broad config rewrites from archived local snapshots.

## Quality Bar

Changes should be easy to review, easy to verify, and honest about remaining
risk. For this project, that means small PRs, typed provider boundaries,
documented manual checks, and visible CI evidence.
