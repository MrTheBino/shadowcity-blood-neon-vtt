import ShadowCityItemBase from "./base-item.mjs";

export default class ShadowCityNpcAttack extends ShadowCityItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.special = new fields.StringField({ required: true, blank: true });
    schema.damage = new fields.StringField({ required: true, blank: true });
    schema.range = new fields.StringField({ required: true, blank: true });
    schema.numAttacks = new fields.NumberField({ required: true, nullable: false, initial: 1, min: 0 });
    schema.attackBonus = new fields.NumberField({ required: true, nullable: false, initial: 0 });
    schema.criticalMultiplier = new fields.NumberField({ required: true, nullable: false, initial: 2, min: 0 });

    return schema;
  }

  prepareDerivedData() {
    
  }
}