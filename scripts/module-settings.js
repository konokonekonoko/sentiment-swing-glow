export default function registerSettings(id, SwingGlowManager) {
  // Global Scope Settings
  game.settings.register(id, "swing-glow-enabled-default", {
    name: "Display Swing Glow Default",
    hint:
      "Swing Glow displays an outline glow matching the current swing's color is shown around tokens. " +
      "This setting determines whether it is enabled by default for all clients. Each client can individually adjust the whether Swing Glow is enabled, regardless of this setting.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(id, "swing-glow-distance-default", {
    name: "Swing Glow Distance Default",
    hint: "Swing Glow Distance will be set to this value by default. It can then be adjusted by each client individually. Each client can individually adjust the Swing Glow Distance, regardless of this setting.",
    scope: "world",
    config: true,
    type: Number,
    default: 15,
    range: {
      min: 1,
      max: 50,
      step: 1,
    },
  });

  game.settings.register(id, "swing-glow-intensity-default", {
    name: "Swing Glow Intensity Default",
    hint: "Swing Glow Intensity will be set to this value by default. Each client can individually adjust the Swing Glow Intensity, regardless of this setting.",
    scope: "world",
    config: true,
    type: Number,
    default: 2,
    range: {
      min: 0.1,
      max: 5.0,
      step: 0.1,
    },
  });

  game.settings.register(id, "swing-glow-quality-default", {
    name: "Swing Glow Intensity Quality",
    hint: "Swing Glow Quality will be set to this value by default. Each client can individually adjust the Swing Glow Quality, regardless of this setting.",
    scope: "world",
    config: true,
    type: Number,
    default: 0.1,
    range: {
      min: 0.1,
      max: 5.0,
      step: 0.1,
    },
  });

  // Client Scope Settings
  game.settings.register(id, "swing-glow-enabled", {
    name: "Display Swing Glow",
    hint:
      "This setting determines whether an outline glow matching the current swing's color is shown around tokens. " +
      "(You will have to change Swing once for this setting to take effect.)",
    scope: "client",
    config: true,
    type: Boolean,
    default: game.settings.get(id, "swing-glow-enabled-default"),
    onChange: () => SwingGlowManager.reloadSettings()
  });

  game.settings.register(id, "swing-glow-distance", {
    name: "Swing Glow Distance",
    hint: "How far the glow extends from the token.",
    scope: "client",
    config: true,
    type: Number,
    default: game.settings.get(id, "swing-glow-distance-default"),
    range: {
      min: 1,
      max: 50,
      step: 1,
    },
    onChange: () => SwingGlowManager.reloadSettings()
  });

  game.settings.register(id, "swing-glow-intensity", {
    name: "Swing Glow Intensity",
    hint: "How intense the Swing Glow is.",
    scope: "client",
    config: true,
    type: Number,
    default: game.settings.get(id, "swing-glow-intensity-default"),
    range: {
      min: 0.1,
      max: 5.0,
      step: 0.1,
    },
    onChange: () => SwingGlowManager.reloadSettings()
  });

  game.settings.register(id, "swing-glow-quality", {
    name: "Swing Glow Quality",
    hint: "The quality of the swing glow. The higher, the less jagged the glow, and less performant.",
    scope: "client",
    config: true,
    type: Number,
    default: game.settings.get(id, "swing-glow-quality-default"),
    range: {
      min: 0.01,
      max: 1,
      step: 0.01,
    },
    onChange: () => SwingGlowManager.reloadSettings()
  });
}
