import ShadowCityActorBase from "./base-actor.mjs";

export default class ShadowCityNPC extends ShadowCityActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    
    schema.level = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });    
    
    schema.abilities = new fields.SchemaField({
      awareness: new fields.SchemaField({
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      physique: new fields.SchemaField({
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      cognition: new fields.SchemaField({
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      quickness: new fields.SchemaField({
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      magnetism: new fields.SchemaField({
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
      willpower: new fields.SchemaField({
        mod_value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }),
    });
    return schema
  }

  prepareDerivedData() {
    //this.xp = this.cr * this.cr * 100;
  }
}