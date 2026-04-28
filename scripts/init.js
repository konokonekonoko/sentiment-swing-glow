import SwingGlowManager from "./glow-manager.js";
import * as Enums from "./enums.js";
import registerSettings from "./module-settings.js";

const MODULE_ID = Enums.MODULE_ID;

Hooks.once("init", async () => {
  SwingGlowManager.log("Initializing");
  registerSettings(MODULE_ID, SwingGlowManager);
  window[MODULE_ID] = SwingGlowManager;
});

Hooks.once("ready", async () => {
  SwingGlowManager.init();

  Hooks.on("updateActor", (actor, updates, metadata, id) => {
    SwingGlowManager.checkTokenGlowUpdate(actor, updates);
  });
});

const placedTokens = new Set();
Hooks.on("drawToken", async (token) => {
  if (placedTokens.has(token)) return;
  if (!token.actor) return;
  SwingGlowManager.updateTokenGlow({
    actor: token.actor,
    targetTokens: [token],
  });
  placedTokens.add(token);
});
