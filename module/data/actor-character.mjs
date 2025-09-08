import ShadowCityActorBase from "./base-actor.mjs";

export default class ShadowCityCharacter extends ShadowCityActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.level = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.humanity = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.money = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.luck = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });

    schema.xp = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })

    schema.bloodpoints = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })

    schema.abilities = new fields.SchemaField({
      awareness: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      physique: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      cognition: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      quickness: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      magnetism: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      willpower: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
    });
    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    /*for (const key in this.abilities) {
      // Calculate the modifier using d20 rules.
      this.abilities[key].mod = Math.floor((this.abilities[key].value - 10) / 2);
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.SHADOWCITY.abilities[key]) ?? key;
    }*/
  }

  getRollData() {
    const data = {};

    /*// Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k,v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.lvl = this.attributes.level.value;*/

    return data
  }
}