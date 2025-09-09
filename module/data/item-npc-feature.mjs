import ShadowCityItemBase from "./base-item.mjs";

export default class ShadowCityNpcFeature extends ShadowCityItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    return schema;
  }

  prepareDerivedData() {
    
  }
}