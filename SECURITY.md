# Security Policy

## Supported Versions

Security fixes target the current `main` branch and the latest release tag, when
a release exists. Older local builds and unpublished development branches are
not supported as separate security maintenance lines.

## Reporting A Vulnerability

Please report suspected vulnerabilities through GitHub private vulnerability
reporting:

https://github.com/AmeerJ97/grok-cli-vertex/security/advisories/new

Use a public issue only for non-sensitive hardening requests. Do not post API
keys, Google Cloud project secrets, Telegram bot tokens, session transcripts,
or private repository contents in public issues.

## Useful Report Details

Include as much non-secret detail as possible:

- Affected version, commit, or install method
- Provider mode (`vertex` or native `xai`)
- Operating system and terminal environment
- Reproduction steps
- Expected impact and whether credentials are required
- Relevant logs with secrets redacted

## Scope

In scope:

- Credential handling in Vertex and native xAI configuration paths
- Local file, shell, MCP, LSP, hook, and sandbox behavior
- Install, update, release, and dependency lifecycle behavior
- Telegram remote-control authentication and pairing behavior

Out of scope:

- Vulnerabilities in upstream cloud provider services
- Social engineering or phishing against maintainers
- Denial-of-service reports that require unrealistic local resource exhaustion
- Reports that depend on exposing intentionally provided local credentials

## Disclosure Expectations

Please give maintainers a reasonable chance to investigate before public
disclosure. The project is community-maintained, so response times may vary, but
security-sensitive reports will be handled separately from public issue triage.
