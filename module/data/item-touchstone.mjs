import ShadowCityItemBase from "./base-item.mjs";

export default class ShadowCityTouchstone extends ShadowCityItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.residence = new fields.StringField({ required: true, nullable: false, initial: "" });

    return schema;
  }
}