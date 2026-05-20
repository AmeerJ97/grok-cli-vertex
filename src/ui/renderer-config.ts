import type { CliRendererConfig } from "@opentui/core";

type EnvLike = { TMUX?: string };

export function isTmuxSession(env: EnvLike = process.env): boolean {
  return Boolean(env.TMUX);
}

export function getInteractiveRendererConfig(env: EnvLike = process.env): CliRendererConfig {
  if (isTmuxSession(env)) {
    return {
      exitOnCtrlC: false,
      debounceDelay: 150,
      targetFps: 20,
      maxFps: 30,
      useKittyKeyboard: null,
    };
  }

  return {
    exitOnCtrlC: false,
    // Lets terminals (Kitty, iTerm2, WezTerm, ...) report Command as `super` on KeyEvent.
    useKittyKeyboard: {
      disambiguate: true,
      alternateKeys: true,
    },
  };
}
