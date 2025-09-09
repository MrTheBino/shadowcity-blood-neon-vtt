import { ShadowCityActorSheetV2 } from './actor-sheet-v2.mjs';
import { rollDialogV1,rollWeaponDialogV1 } from '../lib/roll_dialog.mjs';

export class ShadowCityCharacterSheetV2 extends ShadowCityActorSheetV2 {
    #dragDrop // Private field to hold dragDrop handlers
    /** @inheritDoc */
    static DEFAULT_OPTIONS = {
        classes: ['shadowcity', 'sheet', 'actor'],
        tag: 'form',
        position: {
            width: 600,
            height: 700
        },
        actions: {
            rollAbility: this.#handleRollAbility,
            rollWeapon: this.#handleRollWeapon
        },
        form: {
            submitOnChange: true
        },
        actor: {
            type: 'character'
        },
        dragDrop: [{
            dragSelector: '[data-drag="true"]',
            dropSelector: '.shadowcity.actor'
        }],
        window: {
            resizable: true,
            controls: [
            ]
        }
    }

     static PARTS = {
        header: {
            id: 'header',
            template: 'systems/shadowcity-blood-neon-vtt/templates/actor/parts/character-header.hbs'
        },
        tabs: {
            id: 'tabs',
            template: 'templates/generic/tab-navigation.hbs'
        },
        character: {
            id: 'character',
            template: 'systems/shadowcity-blood-neon-vtt/templates/actor/tabs/tab-character.hbs'
        },
        assets: {
            id: 'assets',
            template: 'systems/shadowcity-blood-neon-vtt/templates/actor/tabs/tab-assets.hbs'
        },
        touchstones: {
            id: 'touchstones',
            template: 'systems/shadowcity-blood-neon-vtt/templates/actor/tabs/tab-touchstones.hbs'
        },
        disciplines: {
            id: 'disciplines',
            template: 'systems/shadowcity-blood-neon-vtt/templates/actor/tabs/tab-disciplines.hbs'
        },
        equipment: {
            id: 'equipment',
            template: 'systems/shadowcity-blood-neon-vtt/templates/actor/tabs/tab-equipment.hbs'
        },
        biography: {
            id: 'biography',
            template: 'systems/shadowcity-blood-neon-vtt/templates/actor/tabs/tab-biography.hbs'
        }
    }

    /**
   * Define the structure of tabs used by this sheet.
   * @type {Record<string, ApplicationTabsConfiguration>}
   */
    static TABS = {
        sheet: { // this is the group name
            tabs:
                [
                    { id: 'character', group: 'sheet', label: 'Details' },
                    { id: 'assets', group: 'sheet', label: 'Assets' },
                    { id: 'touchstones', group: 'sheet', label: 'Touchstones' },
                    { id: 'disciplines', group: 'sheet', label: 'Disciplines' },
                    { id: 'equipment', group: 'sheet', label: 'Equipment' },
                    { id: 'biography', group: 'sheet', label: 'Biography' }
                ],
            initial: 'character'
        }
    }

     /** @override */
    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.usedGearSlots = this.options.document.usedGearSlots;
        
        let items = this._prepareItems();

        foundry.utils.mergeObject(context, items);

        return context;
    }

    _prepareItems() {
        const gear = [];
        const assets = [];
        const touchstones = [];
        const disciplines = [];
        let background = null;
        let bloodline = null;
        let feeding = null;
        let compulsion = null;
        let klass = null;
        const weapons = [];
        const proficiencies = [];

        let inventory = this.options.document.items;
        for (let i of inventory) {
            if (i.type === 'item') {
                gear.push(i);
            }
            else if (i.type === 'asset') {
                assets.push(i);
            }
            else if (i.type === 'touchstone') {
                touchstones.push(i);
            }
            else if (i.type === 'discipline') {
                disciplines.push(i);
            }
            else if (i.type === 'background') {
                background = i;
            }
            else if (i.type === 'bloodline') {
                bloodline = i;
            }
            else if (i.type === 'feeding') {
                feeding = i;
            }
            else if (i.type === 'compulsion') {
                compulsion = i;
            }
            else if (i.type === 'class') {
                klass = i;
            }
            else if (i.type === 'weapon') {
                weapons.push(i);
            }
            else if (i.type === 'proficiency') {
                proficiencies.push(i);
            }
        }

        return {gear: gear, assets: assets, touchstones: touchstones, disciplines: disciplines, background: background, bloodline: bloodline, feeding: feeding, compulsion: compulsion, class: klass, weapons: weapons, proficiencies: proficiencies}
    }

    /** @inheritDoc */
    _onRender(context, options) {
        super._onRender(context, options);
    }

    static async #handleRollAbility(event, element) {
        event.preventDefault();

        const ability = element.dataset.label;
        const formula = element.dataset.formula;
        rollDialogV1(this.actor, formula, ability);
    }

    static async #handleRollWeapon(event, element) {
        event.preventDefault();
        const weaponId = element.dataset.itemId;
        rollWeaponDialogV1(this.actor, weaponId);
    }
}