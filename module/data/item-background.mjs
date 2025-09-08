import ShadowCityItemBase from "./base-item.mjs";

export default class ShadowCityBackground extends ShadowCityItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    return schema;
  }
}