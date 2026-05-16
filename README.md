# grok-cli-vertex: a Vertex AI-focused Grok coding agent

[CI](https://github.com/AmeerJ97/grok-cli-vertex/actions/workflows/typecheck.yml)
[npm package inherited from upstream](https://www.npmjs.com/package/grok-dev)
[License: MIT](./LICENSE)
[TypeScript](https://www.typescriptlang.org/)
[Bun](https://bun.sh/)

> **Disclaimer:** This project is community-built, open-source, and **not affiliated with, endorsed by, or sponsored by xAI Corp. or Google Cloud.** "Grok" is a trademark of xAI Corp. Vertex AI access to Grok is provided by Google Cloud as a partner integration.

This is a standalone fork of `grok-cli` focused on making **Google Cloud Vertex AI** a first-class backend for Grok-powered coding workflows. The project direction is Vertex-first: provider abstraction, ADC-based authentication, Vertex model routing, capability gates, and reliable CLI behavior when Grok is accessed through Google Cloud.

Some native xAI paths remain because they are inherited from upstream and useful for compatibility, comparison, or fallback. They are not the main product focus of this fork.

## Upstream attribution

This project started as a fork of the open-source `grok-cli` codebase. This repo
is maintained as a separate Vertex-focused project, not as a replacement for or
official distribution of the upstream project.

---

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/AmeerJ97/grok-cli-vertex/main/install.sh | bash
```

**Alternative install** (requires Bun on PATH; package name is still inherited):

```bash
bun add -g grok-dev
```

**Self-management** (script-installed only):

```bash
grok update
grok uninstall
grok uninstall --dry-run
grok uninstall --keep-config
```

**Prerequisites:** a Google Cloud project with Vertex AI enabled, Application Default Credentials for local auth, and a modern terminal emulator for the interactive OpenTUI experience. Native xAI mode still requires a **Grok API key** from [x.ai](https://x.ai). Headless `--prompt` mode does not depend on terminal UI support. If you want host desktop automation via the built-in computer sub-agent, also enable **Accessibility** permission for your terminal app on macOS.

---

## Run it

**Interactive (default)** — launches the OpenTUI coding agent:

```bash
grok
```

### Supported terminals

For the most reliable interactive OpenTUI experience, use a modern terminal emulator. We currently document and recommend:

- **WezTerm** (cross-platform)
- **Alacritty** (cross-platform)
- **Ghostty** (macOS and Linux)
- **Kitty** (macOS and Linux)

Other modern terminals may work, but these are the terminal apps we currently recommend and document for interactive use.

**Pick a project directory:**

```bash
grok -d /path/to/your/repo
```

**Headless** — one prompt, then exit (scripts, CI, automation):

```bash
grok --prompt "run the test suite and summarize failures"
grok -p "show me package.json" --directory /path/to/project
grok --prompt "refactor X" --max-tool-rounds 30
grok --prompt "summarize the repo state" --format json
grok --prompt "review the repo overnight" --batch-api
grok --verify
```

`--batch-api` is inherited from the native xAI backend and is not available on
Vertex. In Vertex mode, the CLI returns a typed capability error instead of
pretending the endpoint exists.

**Continue a saved session:**

```bash
grok --session latest
grok -s <session-id>
```

Works in interactive mode too—same flag.

**Structured headless output:**

```bash
grok --prompt "summarize the repo state" --format json
```

`--format json` emits a newline-delimited JSON event stream instead of the
default human-readable text output. Events are semantic, step-level records such
as `step_start`, `text`, `tool_use`, `step_finish`, and `error`.

### Computer sub-agent

Grok ships a built-in `**computer**` sub-agent backed by `[agent-desktop](https://github.com/lahfir/agent-desktop)` for host desktop automation on macOS.

Ask for it in natural language, for example:

```bash
grok "Use the computer sub-agent to take a screenshot of my host desktop and tell me what is open."
grok "Use the computer sub-agent to launch Google Chrome, snapshot the UI, and tell me which refs correspond to the address bar and tabs."
```

Notes:

- Screenshots are saved under `**.grok/computer/**` by default.
- The primary workflow is **snapshot -> refs -> action -> snapshot** using `agent-desktop` accessibility snapshots and stable refs like `@e1`.
- `computer_screenshot` is available for visual confirmation, but the preferred path is `computer_snapshot` plus ref-based actions such as `computer_click`, `computer_type`, and `computer_scroll`.
- macOS requires **System Settings → Privacy & Security → Accessibility** access for the terminal app running `grok`.
- `agent-desktop` currently targets **macOS**.
- If Bun blocks the native binary download during install, run:

```bash
node ./node_modules/agent-desktop/scripts/postinstall.js
```

### Scheduling

Schedules let Grok run a headless prompt on a recurring schedule or once. Ask
for it in natural language, for example:

```text
Create a schedule named daily-changelog-update that runs every weekday at 9am
and updates CHANGELOG.md from the latest merged commits.
```

Recurring schedules require the background daemon:

```bash
grok daemon --background
```

Use `/schedule` in the TUI to browse saved schedules. One-time schedules start
immediately in the background; recurring schedules keep running as long as the
daemon is active.

**List Grok models and pricing hints:**

```bash
grok models
```

**Pass an opening message without another prompt:**

```bash
grok fix the flaky test in src/foo.test.ts
```

Media generation commands are inherited from the xAI backend. They are capability
gated and intentionally return a clear typed error when the active provider is
Vertex.

---

## What this fork focuses on

| Area | Direction |
| --- | --- |
| **Vertex AI backend** | Treat Google Cloud Vertex AI as a primary Grok provider, not a side-channel patch. |
| **Provider abstraction** | Keep backend-specific behavior behind a typed adapter contract. |
| **ADC authentication** | Use Google Application Default Credentials for local and workstation flows. |
| **Vertex model routing** | Encode the documented Vertex Grok SKUs and avoid xAI-only assumptions. |
| **Capability gates** | Return clear typed errors for features that exist on xAI but not Vertex. |
| **CLI continuity** | Preserve useful upstream CLI workflows where they still make sense. |
| **Operational evidence** | Keep verification, typed errors, and runtime self-detection easy to inspect. |

Inherited xAI features are compatibility surfaces. New project work should
prefer the Vertex provider path unless a change is explicitly about fallback or
upstream parity.

---

## Native xAI fallback configuration

Vertex mode does not require a `GROK_API_KEY`; it uses Google ADC plus a Vertex
project id. The settings below apply when you intentionally run the inherited
native xAI provider.

**Environment (good for CI):**

```bash
export GROK_API_KEY=your_key_here
```

`**.env**` in the project (see `.env.example` if present):

```bash
GROK_API_KEY=your_key_here
```

**CLI once:**

```bash
grok -k your_key_here
```

**Saved in user settings** — `~/.grok/user-settings.json`:

```json
{ "apiKey": "your_key_here" }
```

Optional `**subAgents**` — custom foreground sub-agents. Each entry needs `**name**`, `**model**`, and `**instruction**`:

```json
{
  "subAgents": [
    {
      "name": "security-review",
      "model": "grok-4.3",
      "instruction": "Prioritize security implications and suggest concrete fixes."
    }
  ]
}
```

Names cannot be `general`, `explore`, `vision`, `verify`, or `computer` because those are reserved for the built-in sub-agents.

Optional: `**GROK_BASE_URL**` (default `https://api.x.ai/v1`), `**GROK_MODEL**`, `**GROK_MAX_TOKENS**`.

---

## Vertex AI Grok

This fork routes Grok traffic through **Google Cloud Vertex AI** as the preferred backend. The four documented Vertex Grok SKUs are supported:

- `grok-4.20-reasoning` (200K context — default chat model)
- `grok-4.20-non-reasoning`
- `grok-4.1-fast-reasoning` (128K context)
- `grok-4.1-fast-non-reasoning` (128K context — default title/recap model)

### Prerequisites

1. Enable the Vertex AI API on your GCP project.
2. Authenticate locally with **Application Default Credentials**:
   ```bash
   gcloud auth application-default login
   gcloud auth application-default print-access-token   # verify
   ```

### Run

```bash
# CLI flag
grok --provider vertex

# Or via env var
GROK_PROVIDER=vertex GROK_VERTEX_PROJECT_ID=my-gcp-project grok

# Or save in ~/.grok/user-settings.json
{
  "provider": "vertex",
  "vertex": {
    "projectId": "my-gcp-project",
    "location": "global"
  }
}
```

### What works on Vertex

- Chat and streaming
- Local function/tool calling (bash, file edits, LSP, etc.)
- Structured outputs
- Image inputs (vision)
- Reasoning vs non-reasoning by SKU selection

### What's xAI-only (returns a typed error on Vertex)

- xAI `/responses` endpoint and the multi-agent SKUs
- Hosted web search and X search (`search_web`, `search_x`)
- Native xAI image and video generation endpoints
- xAI Batch API (`--batch-api`)
- Telegram audio transcription via Grok STT

### Vertex environment variables

| Var | Purpose | Default |
|---|---|---|
| `GROK_PROVIDER` | Active backend (`xai` or `vertex`) | `xai` |
| `GROK_VERTEX_PROJECT_ID` | GCP project for Vertex requests | — |
| `GCP_PROJECT_ID` | Fallback for `GROK_VERTEX_PROJECT_ID` | — |
| `GROK_VERTEX_LOCATION` | Vertex region (e.g. `us-central1`) | `global` |
| `GROK_VERTEX_BASE_URL` | Vertex API host override | `https://aiplatform.googleapis.com` |

> Authentication is currently **ADC only** (`gcloud auth application-default login`). Pre-minted OAuth tokens and service-account-bound API keys are documented in the Google Cloud quickstart but require additional CLI plumbing — tracked as a follow-up.

> **Disclaimer:** Vertex AI access to Grok is provided by Google Cloud as a partner integration. This project is independent of both xAI Corp. and Google. Pricing and availability are governed by your Google Cloud contract.

---

## Telegram (remote control) — short version

1. Create a bot with [@BotFather](https://t.me/BotFather), copy the token.
2. Set `**TELEGRAM_BOT_TOKEN**` or add `**telegram.botToken**` in `~/.grok/user-settings.json` (the TUI `**/remote-control**` flow can save it).
3. Start `**grok**`, open `**/remote-control**` → **Telegram** if needed, then in Telegram DM your bot: `**/pair`**, enter the **6-character code** in the terminal when asked.
4. First user must be approved once; after that, it’s remembered. **Keep the CLI process running** while you use the bot (long polling lives in that process).

### Voice & audio messages

Send a voice note or audio attachment in Telegram and Grok will transcribe it with the **Grok Speech-to-Text API** (`POST https://api.x.ai/v1/stt`) before passing the text to the agent. The endpoint accepts Telegram's OGG/Opus voice notes and common audio containers (MP3, WAV, M4A, FLAC, AAC) directly — no local model download, `whisper-cli`, or `ffmpeg` required.

#### Prerequisites

- A valid `GROK_API_KEY` (the same key used for the agent). Transcription reuses the CLI's `apiKey` / `baseURL` resolution, so if the agent can reach xAI, transcription will too.

#### Configure in `~/.grok/user-settings.json`

```json
{
  "telegram": {
    "botToken": "YOUR_BOT_TOKEN",
    "audioInput": {
      "enabled": true,
      "language": "en"
    }
  }
}
```


| Setting    | Default | Description                                                                                                           |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| `enabled`  | `true`  | Set to `false` to ignore voice/audio messages entirely.                                                               |
| `language` | `en`    | Language code forwarded to `/v1/stt`. Enables Inverse Text Normalization (numbers, currencies, units → written form). |


Optional headless flow when you do not want the TUI open:

```bash
grok telegram-bridge
```

Treat the bot token like a password.

---

## Hooks

Hooks execute shell commands at key agent lifecycle events — enforce policies, run linters, trigger tests, or log activity.

Configure in `~/.grok/user-settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "bash",
        "hooks": [
          {
            "type": "command",
            "command": "./scripts/lint-before-edit.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

Hook commands receive JSON on **stdin** (event details) and can return JSON on **stdout**. Exit code `0` = success, `2` = block the action, other = non-blocking error.

**Supported events:** `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `UserPromptSubmit`, `SessionStart`, `SessionEnd`, `Stop`, `StopFailure`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `PreCompact`, `PostCompact`, `Notification`, `InstructionsLoaded`, `CwdChanged`.

---

## Instructions & project brain

- `**AGENTS.md`** — merged from git root down to your cwd (Codex-style; see repo docs). `**AGENTS.override.md**` wins per directory when present.

---

## Project settings

Project file: `**.grok/settings.json**` — e.g. the current model for this project.

---

## Sandbox

Grok CLI can run shell commands inside a [Shuru](https://github.com/superhq-ai/shuru) microVM sandbox so the agent can't touch your host filesystem or network.

**Requires macOS 14+ on Apple Silicon.**

Enable it with `--sandbox` on the CLI, or toggle it from the TUI with `/sandbox`.

When sandbox mode is active you can configure:

- **Network** — off by default; enable with `--allow-net`, restrict with `--allow-host`
- **Port forwards** — `--port 8080:80`
- **Resource limits** — CPUs, memory, disk size (via settings or `/sandbox` panel)
- **Checkpoints** — start from a saved environment snapshot
- **Secrets** — inject API keys without exposing them inside the VM

All settings are saved in `~/.grok/user-settings.json` (user) and `.grok/settings.json` (project).

### Verify

Run `**/verify`** in the TUI or `**--verify`** on the CLI to verify your app locally:

```bash
grok --verify
grok -d /path/to/your/app --verify
```

The agent inspects your project, figures out how to build and run it, spins up a sandbox, and produces a verification report with screenshots and video evidence. Works with any app type.

---

## Troubleshooting

Common issues and solutions:

### Installation issues

**Install script fails on macOS**

Make sure you have a modern shell and `curl` available:

```bash
# Verify curl is installed
which curl

# If using an outdated shell, try with bash explicitly
bash -c "$(curl -fsSL https://raw.githubusercontent.com/AmeerJ97/grok-cli-vertex/main/install.sh)"
```

**Bun not found**

The install script bundles Bun, but if you want to use your own:

```bash
curl -fsSL https://bun.sh/install | bash
bun add -g grok-dev
```

### API key issues

**"Missing GROK_API_KEY" error in native xAI mode**

This applies only when running the inherited native xAI provider. Vertex mode
uses Google ADC and `GROK_VERTEX_PROJECT_ID`.

```bash
# Environment variable
export GROK_API_KEY=your_key_here

# Or save to user settings
grok -k your_key_here
```

Get native xAI API keys from [x.ai](https://x.ai).

### Terminal UI issues

**UI doesn't render correctly**

Try a different terminal emulator. Recommended:

- WezTerm (cross-platform)
- Alacritty (cross-platform)
- Ghostty (macOS/Linux)
- Kitty (macOS/Linux)

**Screen flickering or artifacts**

Ensure your terminal supports true color and Unicode. Update your terminal emulator to the latest version.

### Telegram remote control

**Bot doesn't respond**

1. Verify `TELEGRAM_BOT_TOKEN` is set correctly
2. Ensure the CLI process is still running (long polling lives in the process)
3. Check that you've completed the `/pair` flow and been approved

**Voice messages not transcribing**

- Verify `GROK_API_KEY` is set (transcription uses the same key)
- Check `~/.grok/user-settings.json` has `telegram.audioInput.enabled: true`

### Sandbox mode

**Sandbox only works on macOS 14+ with Apple Silicon**

If you're on Intel Mac or Linux, sandbox mode is not available. Use standard mode without `--sandbox`.

### Performance issues

**Slow response times**

- Check your network connection to Google Cloud Vertex AI
- Try `grok-4.1-fast-non-reasoning` for lower-latency Vertex workloads
- Reduce `--max-tool-rounds` for headless runs

**High memory usage**

- Long-running sessions accumulate context; start a fresh session periodically
- Use `/compact` in TUI to compress conversation history

### Getting help

- Check existing [issues](https://github.com/AmeerJ97/grok-cli-vertex/issues)
- Open a new issue with:
  - OS and terminal emulator version
  - Grok CLI version (`grok --version`)
  - Steps to reproduce
  - Error messages or logs

---

## Development

From a clone:

```bash
bun install
bun run build
bun run start
# or: node dist/index.js
```

Other useful commands:

```bash
bun run dev      # run from source (Bun)
bun run typecheck
bun run lint
```

---

## Trademarks

"Grok" is a registered trademark of xAI Corp. This project is not affiliated with, endorsed by, or sponsored by xAI Corp. or Google Cloud. All trademarks belong to their respective owners.

---

## License

MIT
