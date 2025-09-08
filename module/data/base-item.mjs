import ShadowCityDataModel from "./base-model.mjs";

export default class ShadowCityItemBase extends ShadowCityDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};
    const requiredInteger = { required: true, nullable: false, integer: true };

    schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });
    schema.weight = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });
    schema.purchasePrice = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });
    schema.illegal = new fields.BooleanField({ required: true, initial: false });
    schema.description = new fields.StringField({ required: true, blank: true });

    return schema;
  }

}