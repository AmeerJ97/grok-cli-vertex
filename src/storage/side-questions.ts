import type { ChatEntry, SideQuestionEntry } from "../types/index";
import { getDatabase, withTransaction } from "./db";

interface SideQuestionRow {
  id: number;
  session_id: string;
  question: string;
  answer_text: string | null;
  error_text: string | null;
  model: string;
  created_at: string;
}

export interface AppendSideQuestionInput {
  question: string;
  answer?: string | null;
  error?: string | null;
  model: string;
}

export function appendSideQuestion(sessionId: string, input: AppendSideQuestionInput): SideQuestionEntry {
  const createdAt = new Date().toISOString();
  const result = withTransaction((db) => {
    const insert = db
      .prepare(`
        INSERT INTO side_questions (session_id, question, answer_text, error_text, model, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(sessionId, input.question, input.answer ?? null, input.error ?? null, input.model, createdAt) as {
      lastInsertRowid?: number | bigint;
    };

    db.prepare(`
        UPDATE sessions
        SET updated_at = ?
        WHERE id = ?
      `).run(createdAt, sessionId);

    return insert;
  });

  return {
    id: Number(result.lastInsertRowid ?? 0),
    sessionId,
    question: input.question,
    answer: input.answer ?? null,
    error: input.error ?? null,
    model: input.model,
    createdAt: new Date(createdAt),
  };
}

export function listSideQuestions(sessionId: string, limit = 50): SideQuestionEntry[] {
  const rows = getDatabase()
    .prepare(`
      SELECT id, session_id, question, answer_text, error_text, model, created_at
      FROM side_questions
      WHERE session_id = ?
      ORDER BY created_at ASC, id ASC
      LIMIT ?
    `)
    .all(sessionId, limit) as SideQuestionRow[];

  return rows.map(toSideQuestionEntry);
}

export function buildSideQuestionEntries(sessionId: string): ChatEntry[] {
  return listSideQuestions(sessionId, 500).map((entry) => ({
    type: "assistant",
    content: formatSideQuestionEntry(entry),
    timestamp: entry.createdAt,
    sourceLabel: "BTW",
  }));
}

export function formatSideQuestionHistory(entries: SideQuestionEntry[]): string {
  if (entries.length === 0) {
    return "No /btw side questions saved for this session.";
  }

  return entries
    .map((entry, index) => {
      const body = entry.error ? `Error: ${entry.error}` : entry.answer || "(no answer)";
      return `${index + 1}. ${entry.question}\n${body}`;
    })
    .join("\n\n");
}

function formatSideQuestionEntry(entry: SideQuestionEntry): string {
  const body = entry.error ? `Error: ${entry.error}` : entry.answer || "(no answer)";
  return `**/btw** ${entry.question}\n\n${body}`;
}

function toSideQuestionEntry(row: SideQuestionRow): SideQuestionEntry {
  return {
    id: row.id,
    sessionId: row.session_id,
    question: row.question,
    answer: row.answer_text,
    error: row.error_text,
    model: row.model,
    createdAt: new Date(row.created_at),
  };
}
