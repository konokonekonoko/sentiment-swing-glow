import * as Enums from "./enums.js";

const MODULE_ID = Enums.MODULE_ID;
const AttributeIdNoSwing = Enums.AttributeIdNoSwing;

function getTokens(actor) {
  if (actor.isToken && actor.token) {
    return actor.token.object; // unlinked actors
  }
  return actor.getActiveTokens(); // linked actors
}

export function checkTokenGlowUpdate(actor, updates) {
  const newSwingAttributeId = updates?.system?.swing?.attributeId;
  if (newSwingAttributeId) {
    updateActorGlow(actor, newSwingAttributeId);
  }
}

export function updateActorGlow(actor, newSwingAttributeId) {
  const targetTokens = [].concat(getTokens(actor));
  updateTokenGlow({ actor, targetTokens, newSwingAttributeId });
}

export function deleteTokenGlow(token) {
  token.mesh ??= {};
  const previousGlows =
    token.mesh?.filters?.filter((f) => f.filterName === "swing-glow") || [];
  if (previousGlows?.length === 0) return;
  token.mesh.filters =
    token.mesh?.filters?.filter((f) => f.filterName !== "swing-glow") || [];
}

export function updateTokenGlow({
  actor,
  targetTokens,
  newSwingAttributeId,
} = {}) {
  if (!game.settings.get(MODULE_ID, "swing-glow-enabled")) return;

  if (!newSwingAttributeId) newSwingAttributeId = actor?.system?.swing?.attributeId ?? AttributeIdNoSwing;

  if (newSwingAttributeId === AttributeIdNoSwing) {
    for (const token of targetTokens) {
      deleteTokenGlow(token);
    }
    return;
  }

  const attribute = actor.items.get(newSwingAttributeId);
  if (!(attribute && attribute.system.color)) return;

  const glowDistance =
    game.settings.get(MODULE_ID, "swing-glow-distance") || 15;
  const glowOuterStrength =
    game.settings.get(MODULE_ID, "swing-glow-intensity") || 2;

  const newSwing = new PIXI.filters.GlowFilter({
    color: attribute.system.color,
    quality: 0.1,
    distance: glowDistance,
    outerStrength: glowOuterStrength,
    innerStrength: 0,
  });
  newSwing.filterName = "swing-glow";
  newSwing.attributeId = newSwingAttributeId;

  for (const token of targetTokens) {
    token.mesh ??= {};
    const filters = (token.mesh.filters ??= []);

    // if filter is already applied, skip
    if (filters.includes(newSwing)) continue;

    // else, remove old swing
    const newFilters = filters.filter((f) => f.filterName !== "swing-glow");
    newFilters.push(newSwing);
    token.mesh.filters = newFilters;
  }
}
