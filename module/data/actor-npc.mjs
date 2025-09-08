import ShadowCityActorBase from "./base-actor.mjs";

export default class ShadowCityNPC extends ShadowCityActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    
    return schema
  }

  prepareDerivedData() {
    //this.xp = this.cr * this.cr * 100;
  }
}