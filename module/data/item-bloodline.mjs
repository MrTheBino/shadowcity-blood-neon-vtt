import ShadowCityItemBase from "./base-item.mjs";

export default class ShadowCityDiscipline extends ShadowCityItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();
    const requiredInteger = { required: true, nullable: false, integer: true };

    return schema;
  }
}