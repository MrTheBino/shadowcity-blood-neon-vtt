/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ShadowCityItem extends Item {

  static async create(data, options = {}) {
    //make default Friendly and Linked on Creation
    data.prototypeToken = data.prototypeToken || {};

    let defaults = {};
    let image = null;
    
    switch(data.type){
      default:
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-item.svg";
        break;
      case "asset":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-assets.svg";
        break
      case "touchstone":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-touchstone.svg";
        break
      case "discipline":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-discipline.svg";
        break;
      case "weapon":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-weapon.svg";
        break
      case "background":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-background.svg";
        break
      case "bloodline":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-bloodline.svg";
        break
      case "class":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-class.svg";
        break
      case "compulsion":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-compulsion.svg";
        break
      case "feeding":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-feeding.svg";
        break
      case "npcAttack":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-npc-attack.svg";
        break
      case "npcFeature":
        image = "systems/shadowcity-blood-neon-vtt/assets/icons/icon-npc-feature.svg";
        break
    }

    if (image != null) {
      data.img = image
    }

    const actor = await super.create(data, options);
    return actor;
  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   * @override
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const rollData = { ...this.system };

    // Quit early if there's no parent actor
    if (!this.actor) return rollData;

    // If present, add the actor's roll data
    rollData.actor = this.actor.getRollData();

    return rollData;
  }

  /**
   * Convert the actor document to a plain object.
   *
   * The built in `toObject()` method will ignore derived data when using Data Models.
   * This additional method will instead use the spread operator to return a simplified
   * version of the data.
   *
   * @returns {object} Plain object either via deepClone or the spread operator.
   */
  toPlainObject() {
    const result = { ...this };

    // Simplify system data.
    result.system = this.system.toPlainObject();

    // Add effects.
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];

    return result;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? '',
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.formula, rollData.actor);
      // If you need to store the value first, uncomment the next line.
      // const result = await roll.evaluate();
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}
