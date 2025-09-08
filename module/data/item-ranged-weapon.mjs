import ShadowCityItemBase from "./base-item.mjs";

export default class ShadowCityRangedWeapon extends ShadowCityItemBase {

    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        schema.ammo = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
            max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
        });

        schema.range = new fields.StringField({ blank: true });
        schema.damage = new fields.StringField({ blank: true });
        schema.rangedProperties = new fields.SchemaField({
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
        // Build the formula dynamically using string interpolation
        const roll = this.roll;

        this.formula = `${roll.diceNum}${roll.diceSize}${roll.diceBonus}`
    }
}