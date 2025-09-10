import ShadowCityItemBase from "./base-item.mjs";

export default class ShadowCityArmor extends ShadowCityItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();
    const requiredInteger = { required: true, nullable: false, integer: true };

    schema.armorType = new fields.StringField({ required: true, nullable: false, initial: "Light" });
    schema.defense = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.properties = new fields.StringField({ required: true, nullable: false, initial: "" });
    schema.mounted = new fields.BooleanField({ required: true, nullable: false, initial: false });

    return schema;
  }
}