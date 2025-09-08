import ShadowCityItemBase from "./base-item.mjs";

export default class ShadowCityWeapon extends ShadowCityItemBase {

    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        schema.ammo = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
            max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
        });

        schema.ability = new fields.StringField({ blank: false , initial: "physique"});
        schema.range = new fields.StringField({ blank: true , initial: "close"});
        schema.damage = new fields.StringField({ blank: true });
        schema.properties = new fields.SchemaField({
            automatic: new fields.BooleanField({ required: true, initial: false }),
            cloud: new fields.BooleanField({ required: true, initial: false }),
            concealed: new fields.BooleanField({ required: true, initial: false }),
            concussion: new fields.BooleanField({ required: true, initial: false }),
            flame: new fields.BooleanField({ required: true, initial: false }),
            heavy: new fields.BooleanField({ required: true, initial: false }),
            scope: new fields.BooleanField({ required: true, initial: false }),
            splash: new fields.BooleanField({ required: true, initial: false }),
            subdual: new fields.BooleanField({ required: true, initial: false }),
            suppressing: new fields.BooleanField({ required: true, initial: false }),
            twohanded: new fields.BooleanField({ required: true, initial: false })
        })

        return schema;
    }

    prepareDerivedData() {
        
    }
}