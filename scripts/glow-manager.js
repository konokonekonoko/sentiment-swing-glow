import * as Enums from "./enums.js";

export default class SwingGlowManager {
  static MODULE_ID = Enums.MODULE_ID;
  static AttributeIdNoSwing = Enums.AttributeIdNoSwing;

  static #settings = null;

  static init() {
    const settings = this.#loadSettings();
    const canvasTokens = game.canvas.tokens.placeables;
    if (settings.glowEnabled) {
      canvasTokens.forEach((token) => {
        this.updateTokenGlow({
          actor: token.actor,
          targetTokens: [token],
        });
      });
    } else {
      canvasTokens.forEach((token) => {
        this.deleteTokenGlow(token);
      });
    }
  }

  /**
   * Load and caches all settings
   */
  static #loadSettings() {
    if (this.#settings !== null) return this.#settings;
    this.#settings = {
      glowEnabled:
        game.settings.get(this.MODULE_ID, "swing-glow-enabled") ?? false,
      glowDistance:
        game.settings.get(this.MODULE_ID, "swing-glow-distance") || 15,
      glowIntensity:
        game.settings.get(this.MODULE_ID, "swing-glow-intensity") || 2,
      glowQuality:
        game.settings.get(this.MODULE_ID, "swing-glow-quality") || 0.1,
    };
    return this.#settings;
  }

  /**
   * Reset cached settings
   */
  static resetSettingsCache() {
    this.#settings = null;
  }

  /**
   * Reload settings from Foundry Settings
   */
  static reloadSettings() {
    this.resetSettingsCache();
    this.#loadSettings();
    this.init()
    this.log("Reloading Settings",this.#settings)
  }

  /**
   * Pretty logging
   */
  static log(...args) {
    console.log(`${this.MODULE_ID} |`,...args);
  }
  static debug(...args) {
    console.debug(`${this.MODULE_ID} |`,...args);
  }

  /**
   * Get the tokens associated with an actor
   */
  static #getTokens(actor) {
    if (actor.isToken && actor.token) {
      return actor.token.object; // unlinked actors
    }
    return actor.getActiveTokens(); // linked actors
  }

  /**
   * Check if token glow needs updating based on actor updates
   */
  static checkTokenGlowUpdate(actor, updates) {
    const newSwingAttributeId = updates?.system?.swing?.attributeId;
    if (newSwingAttributeId) {
      this.updateActorGlow(actor, newSwingAttributeId);
    }
  }

  /**
   * Handle actor input for `updateTokenGlow`
   */
  static updateActorGlow(actor, newSwingAttributeId) {
    const targetTokens = [].concat(this.#getTokens(actor));
    this.updateTokenGlow({ actor, targetTokens, newSwingAttributeId });
  }

  /**
   * Remove glow filter from a token
   */
  static deleteTokenGlow(token) {
    token.mesh ??= {};
    token.mesh.filters ??= [];
    const previousGlows =
      token.mesh?.filters?.filter((f) => f?.filterName === this.MODULE_ID) ||
      [];
    if (previousGlows?.length === 0) return;
    token.mesh.filters =
      token.mesh?.filters?.filter((f) => f?.filterName !== this.MODULE_ID) ||
      [];
  }

  /**
   * Update glow filter for specified tokens
   */
  static updateTokenGlow({ actor, targetTokens, newSwingAttributeId } = {}) {
    const settings = this.#loadSettings();

    if (!settings.glowEnabled) return;

    if (!newSwingAttributeId) {
      newSwingAttributeId =
        actor?.system?.swing?.attributeId ?? this.AttributeIdNoSwing;
    }

    if (newSwingAttributeId === this.AttributeIdNoSwing) {
      for (const token of targetTokens) {
        this.deleteTokenGlow(token);
      }
      return;
    }

    const attribute = actor.items.get(newSwingAttributeId);
    if (!(attribute && attribute.system.color)) return;

    const newSwing = new PIXI.filters.GlowFilter({
      color: attribute.system.color,
      quality: settings.glowQuality,
      distance: settings.glowDistance,
      outerStrength: settings.glowIntensity,
      innerStrength: 0,
    });
    newSwing.filterName = this.MODULE_ID;
    newSwing.attributeId = newSwingAttributeId;

    this.debug("Updating token glow for", actor, "with", newSwing)

    for (const token of targetTokens) {
      token.mesh ??= {};
      token.mesh.filters ??= [];
      const filters = token.mesh.filters;

      // if filter is already applied, skip
      if (filters.includes(newSwing)) continue;

      // else, remove old swing
      const newFilters = filters.filter(
        (f) => f?.filterName !== this.MODULE_ID
      );
      newFilters.push(newSwing);
      token.mesh.filters = newFilters;
    }
  }
}
