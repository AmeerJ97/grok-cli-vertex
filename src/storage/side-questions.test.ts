import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { closeDatabase } from "./db";
import { SessionStore } from "./sessions";
import {
  appendSideQuestion,
  buildSideQuestionEntries,
  formatSideQuestionHistory,
  listSideQuestions,
} from "./side-questions";
import { loadTranscript } from "./transcript";

const originalHome = process.env.HOME;

describe("side question persistence", () => {
  const tempRoot = path.join(process.cwd(), ".tmp-side-question-tests");
  let tempHome = "";
  let tempCwd = "";

  beforeEach(() => {
    fs.mkdirSync(tempRoot, { recursive: true });
    tempHome = fs.mkdtempSync(path.join(tempRoot, "grok-side-home-"));
    tempCwd = fs.mkdtempSync(path.join(tempRoot, "grok-side-cwd-"));
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

  it("stores side questions separately from the model transcript", () => {
    const session = new SessionStore(tempCwd).createSession("grok-4.3", "agent", tempCwd);

    appendSideQuestion(session.id, {
      question: "What does this hook do?",
      answer: "It registers a side effect.",
      model: "grok-4.3",
    });

    expect(loadTranscript(session.id)).toEqual([]);
    expect(listSideQuestions(session.id)).toMatchObject([
      {
        question: "What does this hook do?",
        answer: "It registers a side effect.",
        error: null,
        model: "grok-4.3",
      },
    ]);
    expect(buildSideQuestionEntries(session.id)[0]).toMatchObject({
      type: "assistant",
      sourceLabel: "BTW",
      content: expect.stringContaining("What does this hook do?"),
    });
  });

  it("formats an empty side-question history", () => {
    expect(formatSideQuestionHistory([])).toBe("No /btw side questions saved for this session.");
  });
});
