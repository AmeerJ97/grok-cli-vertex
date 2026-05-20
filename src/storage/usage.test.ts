import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { closeDatabase } from "./db";
import { SessionStore } from "./sessions";
import { listSessionUsage, recordUsageEvent } from "./usage";

const originalHome = process.env.HOME;

describe("usage telemetry", () => {
  const tempRoot = path.join(process.cwd(), ".tmp-usage-tests");
  let tempHome = "";
  let tempCwd = "";

  beforeEach(() => {
    fs.mkdirSync(tempRoot, { recursive: true });
    tempHome = fs.mkdtempSync(path.join(tempRoot, "grok-usage-home-"));
    tempCwd = fs.mkdtempSync(path.join(tempRoot, "grok-usage-cwd-"));
    process.env.HOME = tempHome;
    vi.spyOn(os, "homedir").mockReturnValue(tempHome);
    closeDatabase();
  });

  afterEach(() => {
    closeDatabase();
    vi.restoreAllMocks();
    process.env.HOME = originalHome;
    fs.rmSync(tempHome, { recursive: true, force: true });
    fs.rmSync(tempCwd, { recursive: true, force: true });
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("estimates cost for canonical Vertex model ids", () => {
    const session = new SessionStore(tempCwd).createSession("grok-4.20-reasoning", "agent", tempCwd);

    recordUsageEvent(session.id, "message", "grok-4.20-reasoning", {
      inputTokens: 1_000_000,
      outputTokens: 1_000_000,
      totalTokens: 2_000_000,
    });

    const [event] = listSessionUsage(session.id);
    expect(event?.costMicros).toBe(8_000_000);
  });
});
