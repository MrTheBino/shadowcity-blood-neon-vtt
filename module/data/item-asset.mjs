import ShadowCityItemBase from "./base-item.mjs";

export default class ShadowCityAsset extends ShadowCityItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.assetType = new fields.StringField({ required: true, nullable: false, initial: "ally" });

    return schema;
  }

  prepareDerivedData() {
    this.localizedType = game.i18n.localize(`SHADOWCITY.ASSET_TYPES.${this.assetType}`);
  }
}