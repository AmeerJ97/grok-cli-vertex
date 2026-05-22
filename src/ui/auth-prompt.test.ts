import { describe, expect, it } from "vitest";
import { getAuthPromptConfig } from "./auth-prompt";

describe("getAuthPromptConfig", () => {
  it("keeps the xAI API key prompt for native xAI mode", () => {
    expect(getAuthPromptConfig("xai")).toMatchObject({
      title: "Add API key",
      placeholder: "xai-...",
      canSaveApiKey: true,
    });
  });

  it("does not ask for an xAI API key when Vertex is active", () => {
    expect(getAuthPromptConfig("vertex", "project-1")).toMatchObject({
      title: "Configure Vertex AI",
      placeholder: "GROK_VERTEX_PROJECT_ID=...",
      canSaveApiKey: false,
    });
  });

  it("documents both supported Vertex project environment variables", () => {
    expect(getAuthPromptConfig("vertex").message).toContain("GCP_PROJECT_ID");
  });
});
