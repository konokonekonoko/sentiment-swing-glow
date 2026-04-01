import * as GlowManager from "./glow-manager.js";
import * as Enums from "./enums.js";
import registerSettings from "./module-settings.js";
// import GlowSocketHandler from "./socket-handler.js";

const MODULE_ID = Enums.MODULE_ID;

Hooks.once("init", async () => {
  const module = game.modules.get(MODULE_ID);
  registerSettings(MODULE_ID);
});

Hooks.once("canvasReady", (canvas) => {
  
});


Hooks.once("ready", async () => {

  // get swing once on startup
  if (game.settings.get(MODULE_ID, "swing-glow-enabled")) {
    game.canvas.tokens.placeables.forEach((token) => {
      GlowManager.updateTokenGlow({
        actor: token.actor,
        targetTokens: [token]
      });
    });
  }
  else {
    game.canvas.tokens.placeables.forEach((token) => {
      GlowManager.deleteTokenGlow(token);
    });
    
  }

  Hooks.on("updateActor", (actor,updates,metadata,id) => {
    GlowManager.checkTokenGlowUpdate(actor,updates);
  })
});