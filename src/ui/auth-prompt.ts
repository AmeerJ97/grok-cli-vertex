import type { ProviderKind } from "../providers/types";

export interface AuthPromptConfig {
  title: string;
  message: string;
  placeholder: string;
  canSaveApiKey: boolean;
}

export function getAuthPromptConfig(provider: ProviderKind, vertexProjectId?: string): AuthPromptConfig {
  if (provider === "vertex") {
    return {
      title: "Configure Vertex AI",
      message: vertexProjectId
        ? "Vertex AI is selected and a project id is configured. Authenticate with Google Application Default Credentials, then retry."
        : "Vertex AI is selected but no project id is configured. Set GROK_VERTEX_PROJECT_ID or save vertex.projectId in ~/.grok/user-settings.json.",
      placeholder: "GROK_VERTEX_PROJECT_ID=...",
      canSaveApiKey: false,
    };
  }

  return {
    title: "Add API key",
    message: "Paste your xAI API key to unlock chat. You can hide this prompt with esc.",
    placeholder: "xai-...",
    canSaveApiKey: true,
  };
}
