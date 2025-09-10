/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/shadowcity-blood-neon-vtt/templates/actor/tabs/tab-character.hbs',
    'systems/shadowcity-blood-neon-vtt/templates/actor/parts/character-header.hbs',
    'systems/shadowcity-blood-neon-vtt/templates/actor/parts/ability-partial.hbs',
    'systems/shadowcity-blood-neon-vtt/templates/actor/parts/npc-ability-partial.hbs',
    'systems/shadowcity-blood-neon-vtt/templates/actor/parts/single-feature.hbs',
    'systems/shadowcity-blood-neon-vtt/templates/shared/ranged-select-dropdown.hbs',
    'systems/shadowcity-blood-neon-vtt/templates/shared/ability-select-dropdown.hbs',
    'systems/shadowcity-blood-neon-vtt/templates/shared/weapon-properties-descriptor.hbs',
    'systems/shadowcity-blood-neon-vtt/templates/shared/move-select-partial.hbs',

    // Item partials
    'systems/shadowcity-blood-neon-vtt/templates/item/parts/item-effects.hbs',
  ]);
};
