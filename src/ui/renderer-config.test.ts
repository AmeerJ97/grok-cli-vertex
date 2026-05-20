import { describe, expect, it } from "vitest";
import { getInteractiveRendererConfig, isTmuxSession } from "./renderer-config";

describe("interactive renderer config", () => {
  it("enables enhanced keyboard reporting outside tmux", () => {
    const config = getInteractiveRendererConfig({ TMUX: "" });

    expect(config.exitOnCtrlC).toBe(false);
    expect(config.useKittyKeyboard).toEqual({
      disambiguate: true,
      alternateKeys: true,
    });
    expect(config.targetFps).toBeUndefined();
  });

  it("uses a conservative render profile inside tmux", () => {
    const config = getInteractiveRendererConfig({ TMUX: "/tmp/tmux-1000/default,123,0" });

    expect(isTmuxSession({ TMUX: "/tmp/tmux-1000/default,123,0" })).toBe(true);
    expect(config.useKittyKeyboard).toBeNull();
    expect(config.targetFps).toBe(20);
    expect(config.maxFps).toBe(30);
    expect(config.debounceDelay).toBe(150);
  });
});
