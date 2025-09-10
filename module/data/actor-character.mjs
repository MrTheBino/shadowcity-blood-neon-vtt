import ShadowCityActorBase from "./base-actor.mjs";

export default class ShadowCityCharacter extends ShadowCityActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.level = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.humanity = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.money = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.luck = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.availableGearSlots = new fields.NumberField({ required: true, nullable: false, initial: 3, min: 0 });

    schema.xp = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })

    schema.bloodpoints = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      used: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })

    schema.abilities = new fields.SchemaField({
      awareness: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        bloodboost: new fields.BooleanField({ required: true, initial: false })
      }),
      physique: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        bloodboost: new fields.BooleanField({ required: true, initial: false })
      }),
      cognition: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        bloodboost: new fields.BooleanField({ required: true, initial: false })
      }),
      quickness: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        bloodboost: new fields.BooleanField({ required: true, initial: false }) 
      }),
      magnetism: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        bloodboost: new fields.BooleanField({ required: true, initial: false })
      }),
      willpower: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        bloodboost: new fields.BooleanField({ required: true, initial: false })
      }),
    });
    return schema;
  }

  prepareDerivedData() {
    //this.reactionCheckFormula = `2D6+${this.system.abilities.magnetism.mod_value}`;
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