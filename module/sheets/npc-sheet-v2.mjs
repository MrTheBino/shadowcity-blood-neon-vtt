import { ShadowCityActorSheetV2 } from './actor-sheet-v2.mjs';
import { ShadowCityItem } from '../documents/item.mjs'
import { rollDialogV1,rollNpcAttackDialog } from '../lib/roll_dialog.mjs';

export class ShadowCityNpcSheetV2 extends ShadowCityActorSheetV2 {
    /** @inheritDoc */
    static DEFAULT_OPTIONS = {
        classes: ['shadowcity', 'sheet', 'actor'],
        tag: 'form',
        position: {
            width: 700,
            height: 700
        },
        actions: {
            rollAbility: this.#handleRollAbility,
            rollAttack: this.#handleRollAttack
        },
        form: {
            submitOnChange: true
        },
        actor: {
            type: 'npc'
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

    /** @inheritDoc */
    static PARTS = {
        header: {
            id: 'header',
            template: 'systems/shadowcity-blood-neon-vtt/templates/actor/parts/npc-header.hbs'
        },
        tabs: {
            id: 'tabs',
            template: 'templates/generic/tab-navigation.hbs'
        },
        abilities: {
            id: 'abilities',
            template: 'systems/shadowcity-blood-neon-vtt/templates/actor/tabs/tab-npc-abilities.hbs'
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
                    { id: 'abilities', group: 'sheet', label: 'Abilities' },
                    { id: 'biography', group: 'sheet', label: 'Biography' },
                ],
            initial: 'abilities'
        }
    }

    constructor(options = {}) {
        super(options)
    }

    /** @override */
    async _prepareContext(options) {
        let context = await super._prepareContext(options);

        let items = this._prepareItems();

        foundry.utils.mergeObject(context, items);
        return context;
    }

    _prepareItems() {
        const attacks = [];
        const features = [];


        let inventory = this.options.document.items;
        for (let i of inventory) {
            if (i.type === 'npcAttack') {
                attacks.push(i);
            }
            else if (i.type === 'npcFeature') {
                features.push(i);
            }
        }

        return { attacks: attacks, features: features }
    }

    static async #handleRollAbility(event, element) {
        event.preventDefault();

        const ability = element.dataset.label;
        const formula = element.dataset.formula;
        rollDialogV1(this.actor, formula, ability);
    }

    static async #handleRollAttack(event, element) {
        event.preventDefault();

        const attackId = element.dataset.attackId;
        rollNpcAttackDialog(this.actor, attackId);
    }
}