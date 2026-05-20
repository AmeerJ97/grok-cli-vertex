import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { closeDatabase } from "./db";
import { SessionStore } from "./sessions";

const originalHome = process.env.HOME;

describe("SessionStore recap persistence", () => {
  const tempRoot = path.join(process.cwd(), ".tmp-session-tests");
  let tempHome = "";
  let tempCwd = "";
  let tempDirs: string[] = [];

  beforeEach(() => {
    fs.mkdirSync(tempRoot, { recursive: true });
    tempHome = fs.mkdtempSync(path.join(tempRoot, "grok-session-home-"));
    tempCwd = fs.mkdtempSync(path.join(tempRoot, "grok-session-cwd-"));
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
    for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true });
    tempDirs = [];
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("stores and reloads the latest recap metadata with the session", () => {
    const store = new SessionStore(tempCwd);
    const session = store.createSession("grok-4.3", "agent", tempCwd);
    const updatedAt = new Date("2026-04-22T15:00:00.000Z");

    store.setRecap(session.id, {
      text: "Migrated billing sessions to the new schema. Next step is wiring the prompt banner.",
      model: "grok-4.20-non-reasoning",
      updatedAt,
    });

    expect(store.getRequiredSession(session.id).recap).toEqual({
      text: "Migrated billing sessions to the new schema. Next step is wiring the prompt banner.",
      model: "grok-4.20-non-reasoning",
      updatedAt,
    });
  });

  it("clears recap metadata when the recap is removed", () => {
    const store = new SessionStore(tempCwd);
    const session = store.createSession("grok-4.3", "agent", tempCwd);

    store.setRecap(session.id, {
      text: "Temporary recap",
      model: "grok-4.20-non-reasoning",
      updatedAt: new Date("2026-04-22T15:00:00.000Z"),
    });
    store.setRecap(session.id, null);

    expect(store.getRequiredSession(session.id).recap).toBeNull();
  });

  it("touches cwd_last when resuming the latest session", () => {
    const workspaceRoot = fs.mkdtempSync(path.join(tempRoot, "grok-session-workspace-"));
    const firstCwd = path.join(workspaceRoot, "first");
    const resumedCwd = path.join(workspaceRoot, "resumed");
    fs.mkdirSync(path.join(workspaceRoot, ".git"), { recursive: true });
    fs.mkdirSync(firstCwd, { recursive: true });
    fs.mkdirSync(resumedCwd, { recursive: true });
    tempDirs.push(workspaceRoot);

    const firstStore = new SessionStore(firstCwd);
    const session = firstStore.createSession("grok-4.3", "agent", firstCwd);
    const resumedStore = new SessionStore(resumedCwd);
    const resumed = resumedStore.openSession("latest", "grok-4.3", "agent", resumedCwd);

    expect(resumed.id).toBe(session.id);
    expect(resumed.cwdLast).toBe(resumedCwd);
  });
});
