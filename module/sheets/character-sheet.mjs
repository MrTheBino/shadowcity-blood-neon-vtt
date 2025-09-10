import { ShadowCityActorSheetV2 } from './actor-sheet-v2.mjs';
import { rollDialogV1, rollWeaponDialogV1 } from '../lib/roll_dialog.mjs';

export class ShadowCityCharacterSheetV2 extends ShadowCityActorSheetV2 {
    #dragDrop // Private field to hold dragDrop handlers
    /** @inheritDoc */
    static DEFAULT_OPTIONS = {
        classes: ['shadowcity', 'sheet', 'actor'],
        tag: 'form',
        position: {
            width: 600,
            height: 750
        },
        actions: {
            rollAbility: this.#handleRollAbility,
            rollWeapon: this.#handleRollWeapon,
            rollFrenzyCheck: this.#handleRollFrenzyCheck,
            rollExpendedFrenzyCheck: this.#handleRollExpendedFrenzyCheck,
            useDiscipline: this.#handleUseDiscipline,
            clickRiseAtSundown: this.#handleRiseAtSundown,
            clickBloodHealing: this.#handleBloodHealing
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
        context.defenseCalculated = this.options.document.defenseCalculated;

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
        const armor = []

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
            else if (i.type === 'armor') {
                armor.push(i);
            }
        }

        return { gear: gear, assets: assets, touchstones: touchstones, disciplines: disciplines, background: background, bloodline: bloodline, feeding: feeding, compulsion: compulsion, class: klass, weapons: weapons, proficiencies: proficiencies, armor: armor };
    }

    /** @inheritDoc */
    _onRender(context, options) {
        super._onRender(context, options);
        const bloodboostSelect = this.element.querySelectorAll('.bloodboost-select');
        for (const element of bloodboostSelect) {
            element.addEventListener("change", event => this.handleBloodboostSelect(element))
        }
    }

    async handleBloodboostSelect(element) {
        const selectedValue = element.value;

        this.actor.update({ "system.abilities.awareness.bloodboost": false });
        this.actor.update({ "system.abilities.physique.bloodboost": false });
        this.actor.update({ "system.abilities.cognition.bloodboost": false });
        this.actor.update({ "system.abilities.quickness.bloodboost": false });
        this.actor.update({ "system.abilities.magnetism.bloodboost": false });
        this.actor.update({ "system.abilities.willpower.bloodboost": false });
        if (selectedValue !== "none") {
            const path = `system.abilities.${selectedValue}.bloodboost`;
            this.actor.update({ [path]: true });
        }
        // Handle the blood boost selection logic here
    }

    static async #handleRollAbility(event, element) {
        event.preventDefault();

        const ability = element.dataset.label;
        const formula = element.dataset.formula;
        rollDialogV1(this.actor, formula, ability);
    }

    static async #handleRollExpendedFrenzyCheck(event, element) {
        event.preventDefault();
        rollDialogV1(this.actor, "0", "Expending Blood Frenzy", 5 + this.actor.system.bloodpoints.used);
    }

    static async #handleRollFrenzyCheck(event, element) {
        event.preventDefault();
        rollDialogV1(this.actor, "0", "Frenzy", 10 - this.actor.system.level);
    }

    static async #handleRollWeapon(event, element) {
        event.preventDefault();
        const weaponId = element.dataset.itemId;
        rollWeaponDialogV1(this.actor, weaponId);
    }

    static async #handleBloodHealing(event, element) {
        event.preventDefault();
        if(this.actor.system.bloodpoints.value <= 0){
            return;
        }

        const proceed = await foundry.applications.api.DialogV2.confirm({
            content: `As a free action, a vampire can expend 1 BP to heal 1d6 HP. You can only do this once per round. You want to heal now?`,
            rejectClose: false,
            modal: true
        });
        if (proceed) {
            const diceRoll = new Roll("1d6", this.actor.getRollData());
            await diceRoll.evaluate();
             if (game.dice3d) {
                await game.dice3d.showForRoll(diceRoll, game.user, true, null, false);
            }
            this.actor.update({ "system.bloodpoints.value": this.actor.system.bloodpoints.value - 1 });
            this.actor.update({ "system.health.value": Math.min(this.actor.system.health.max, this.actor.system.health.value + diceRoll.total) });

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: `Blood Healing: Healed ${diceRoll.total} HP, spending 1 BP. ${this.actor.system.bloodpoints.value} BP remaining.`
            });
        }
    }

    static async #handleRiseAtSundown(event, element) {
        event.preventDefault();
        const proceed = await foundry.applications.api.DialogV2.confirm({
            content: `Is your vampire rising up at sundown?`,
            rejectClose: false,
            modal: true
        });
        if (proceed) {
            this.actor.update({ "system.bloodpoints.value": this.actor.system.bloodpoints.value - 1 });
            this.actor.update({ "system.bloodpoints.used": 0 });
            if (this.actor.system.bloodpoints.value < 0) {
                this.actor.update({ "system.bloodpoints.value": 0 });
            }

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: `Rised up at sundown! 1 BP spent. ${this.actor.system.bloodpoints.value} BP remaining. BP used per night reset to 0.`
            });
        }
    }

    static async #handleUseDiscipline(event, element) {
        event.preventDefault();
        const disciplineId = element.dataset.itemId;
        const discipline = this.actor.items.get(disciplineId);

        const proceed = await foundry.applications.api.DialogV2.confirm({
            content: `Do you want to use ${discipline.name} for ${discipline.system.bloodpoints} bloodpoints?`,
            rejectClose: false,
            modal: true
        });
        if (proceed) {
            this.actor.update({ "system.bloodpoints.used": this.actor.system.bloodpoints.used + discipline.system.bloodpoints });
            this.actor.update({ "system.bloodpoints.value": this.actor.system.bloodpoints.value - discipline.system.bloodpoints });

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: `Used discipline ${discipline.name}, spending ${discipline.system.bloodpoints} BP. ${this.actor.system.bloodpoints.value} BP remaining. ${this.actor.system.bloodpoints.used} BP used this night.`
            });
        }
    }
}