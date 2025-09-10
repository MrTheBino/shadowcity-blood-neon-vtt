import { ShadowCityDialog } from "./dialog.mjs";
import {abilityModifier} from "./util.mjs";

export function addShowDicePromise(promises, roll) {
    if (game.dice3d) {
        // we pass synchronize=true so DSN dice appear on all players' screens
        promises.push(game.dice3d.showForRoll(roll, game.user, true, null, false));
    }
}

function applyAdvantageDisadvantage(roll, advantage_modifier) {
    console.log("Applying advantage/disadvantage:", advantage_modifier);
    if(advantage_modifier === 0) return roll; // No advantage or disadvantage
    if(advantage_modifier > 0){
        roll = roll.replace("1D20", "2D20kh");
    }else{
        roll = roll.replace("1D20", "2D20kl");
    }
    return roll
}

export async function rollDialogV1(actor, formula, label,difficulty = 0) {
    const cardTitle = label;
    if(parseInt(formula) < 0){
        formula = "1D20" + formula;
    }else{
        formula = "1D20+" + formula;
    }
    
    const dialogVars = {
        actor,
        formula,
        label,
        difficulty
    };

    const html = await foundry.applications.handlebars.renderTemplate(
        "systems/shadowcity-blood-neon-vtt/templates/dialogs/roll-dialog.hbs",
        dialogVars
    );

    return new Promise((resolve) => {
        new ShadowCityDialog({
            window: { title: cardTitle },
            content: html,
            buttons: [
                {
                    action: 'roll',
                    icon: '<i class="fas fa-dice-d6"></i>',
                    label: game.i18n.localize("SHADOWCITY.LABELS.RollNormal"),
                    callback: (event, button, dialog) => rollDialogV1Callback(event, button, dialog, actor,0),
                },
                {
                    action: 'rollAdvantage',
                    icon: '<i class="fas fa-dice-d6"></i>',
                    label: game.i18n.localize("SHADOWCITY.LABELS.RollAdvantage"),
                    callback: (event, button, dialog) => rollDialogV1Callback(event, button, dialog, actor,1),
                },
                {
                    action: 'rollDisadvantage',
                    icon: '<i class="fas fa-dice-d6"></i>',
                    label: game.i18n.localize("SHADOWCITY.LABELS.RollDisadvantage"),
                    callback: (event, button, dialog) => rollDialogV1Callback(event, button, dialog, actor,-1),
                },
            ],
            default: "roll",
            close: () => resolve(null),
        }).render(true);
    });
}

async function rollDialogV1Callback(event, button, dialog, actor,advantage_modifier) {
    let dicePromises = [];
    const actorRollData = actor.getRollData();
    const form = button.form;
    const formula = applyAdvantageDisadvantage(form.formula.value,advantage_modifier);
    const rollLabel = form.label.value;
    const difficulty = parseInt(form.difficulty.value) || 0;

    console.log(formula);
    const diceRoll = new Roll(formula, actorRollData);
    await diceRoll.evaluate();
    addShowDicePromise(dicePromises, diceRoll);
    await Promise.all(dicePromises);

    let rollRenderedHTML = await diceRoll.render();

    let isSuccess = false;
    if(difficulty > 0){
        isSuccess = diceRoll.total >= difficulty;
    }

    const html = await foundry.applications.handlebars.renderTemplate(
        "systems/shadowcity-blood-neon-vtt/templates/chat/roll-result.hbs",
        { roll: diceRoll, label: rollLabel, rollRenderedHTML:rollRenderedHTML, isSuccess:isSuccess, difficulty: difficulty }
    );

    ChatMessage.create({
        content: html,
        speaker: ChatMessage.getSpeaker({ actor }),
    });
}

export async function rollWeaponDialogV1(actor, weaponId) {
    const weapon = actor.items.get(weaponId);
    
    let humanityAttackBonus = 0;
    
    if(actor.system.humanity < 0){
        humanityAttackBonus = actor.system.humanity * -1;
    }

    let modifier = 0;
    if(weapon.system.ability === "awareness"){
        modifier = abilityModifier(actor.system.abilities.awareness);
    }else if(weapon.system.ability === "physique"){
        modifier = abilityModifier(actor.system.abilities.physique);
    }

    const dialogVars = {
        actor,
        weaponId,
        weapon,
        humanityAttackBonus,
        modifier
    };

    const html = await foundry.applications.handlebars.renderTemplate(
        "systems/shadowcity-blood-neon-vtt/templates/dialogs/weapon-roll-dialog.hbs",
        dialogVars
    );

    return new Promise((resolve) => {
        new ShadowCityDialog({
            window: { title: weapon.name },
            content: html,
            buttons: [
                {
                    action: 'roll',
                    icon: '<i class="fas fa-dice-d6"></i>',
                    label: game.i18n.localize("SHADOWCITY.LABELS.RollNormal"),
                    callback: (event, button, dialog) => rollWeaponDialogV1Callback(event, button, dialog, actor, 0),
                },
                {
                    action: 'rollAdvantage',
                    icon: '<i class="fas fa-dice-d6"></i>',
                    label: game.i18n.localize("SHADOWCITY.LABELS.RollAdvantage"),
                    callback: (event, button, dialog) => rollWeaponDialogV1Callback(event, button, dialog, actor, 1),
                },
                {
                    action: 'rollDisadvantage',
                    icon: '<i class="fas fa-dice-d6"></i>',
                    label: game.i18n.localize("SHADOWCITY.LABELS.RollDisadvantage"),
                    callback: (event, button, dialog) => rollWeaponDialogV1Callback(event, button, dialog, actor, -1),
                },
            ],
            default: "roll",
            close: () => resolve(null),
        }).render(true);
    });
}

async function rollWeaponDialogV1Callback(event, button, dialog, actor, advantage_modifier) {
    const form = button.form;
    const weaponId = form.weaponId.value;
    const weapon = actor.items.get(weaponId);
    const selectedAbility = form.ability.value;
    const modifier = parseInt(form.modifier.value) || 0;
    const damageFormula = form.damageFormula.value;
    const humanityAttackBonus = parseInt(form.humanityAttackBonus.value) || 0;
    let dicePromises = [];
    const actorRollData = actor.getRollData();

    if(!weapon) return;

    let formula = applyAdvantageDisadvantage("1D20", advantage_modifier);
    formula = `${formula}+${modifier}+${humanityAttackBonus}`;

    
    const diceRoll = new Roll(formula, actorRollData);
    await diceRoll.evaluate();
    addShowDicePromise(dicePromises, diceRoll);

    const damageRoll = new Roll(damageFormula, actorRollData);
    await damageRoll.evaluate();
    addShowDicePromise(dicePromises, damageRoll);

    
    await Promise.all(dicePromises);

    let rollRenderedHTML = await diceRoll.render();
    let rollDamageRenderedHTML = await damageRoll.render();

    const html = await foundry.applications.handlebars.renderTemplate(
        "systems/shadowcity-blood-neon-vtt/templates/chat/weapon-roll-result.hbs",
        { roll: diceRoll, label: weapon.name, rollRenderedHTML:rollRenderedHTML, ability:selectedAbility, weapon: weapon, rollDamageRenderedHTML: rollDamageRenderedHTML }
    );
    ChatMessage.create({
        content: html,
        speaker: ChatMessage.getSpeaker({ actor }),
    });
}

export async function rollNpcAttackDialog(actor, attackId) {
    const attack = actor.items.get(attackId);

    const dialogVars = {
        actor,
        attackId,
        attack
    };

    const html = await foundry.applications.handlebars.renderTemplate(
        "systems/shadowcity-blood-neon-vtt/templates/dialogs/npc-attack-roll-dialog.hbs",
        dialogVars
    );

    return new Promise((resolve) => {
        new ShadowCityDialog({
            window: { title: attack.name },
            content: html,
            buttons: [
                {
                    action: 'roll',
                    icon: '<i class="fas fa-dice-d6"></i>',
                    label: game.i18n.localize("SHADOWCITY.LABELS.RollNormal"),
                    callback: (event, button, dialog) => rollNpcAttackV1Callback(event, button, dialog, actor, 0),
                },
                {
                    action: 'rollAdvantage',
                    icon: '<i class="fas fa-dice-d6"></i>',
                    label: game.i18n.localize("SHADOWCITY.LABELS.RollAdvantage"),
                    callback: (event, button, dialog) => rollNpcAttackV1Callback(event, button, dialog, actor, 1),
                },
                {
                    action: 'rollDisadvantage',
                    icon: '<i class="fas fa-dice-d6"></i>',
                    label: game.i18n.localize("SHADOWCITY.LABELS.RollDisadvantage"),
                    callback: (event, button, dialog) => rollNpcAttackV1Callback(event, button, dialog, actor, -1),
                },
            ],
            default: "roll",
            close: () => resolve(null),
        }).render(true);
    });
}
async function rollNpcAttackV1Callback(event, button, dialog, actor, advantage_modifier) {
    const form = button.form;
    const attackId = form.attackId.value;
    const attack = actor.items.get(attackId);
    const modifier = parseInt(form.modifier.value) || 0;
    const damageFormula = form.damageFormula.value;
    let dicePromises = [];
    const actorRollData = actor.getRollData();

    if(!attack) return;


    let formula = applyAdvantageDisadvantage("1D20", advantage_modifier);
    formula = `${formula}+${modifier}`;

    
    const diceRoll = new Roll(formula, actorRollData);
    await diceRoll.evaluate();
    addShowDicePromise(dicePromises, diceRoll);

    const damageRoll = new Roll(damageFormula, actorRollData);
    await damageRoll.evaluate();
    addShowDicePromise(dicePromises, damageRoll);

    
    await Promise.all(dicePromises);

    let rollRenderedHTML = await diceRoll.render();
    let rollDamageRenderedHTML = await damageRoll.render();

    const html = await foundry.applications.handlebars.renderTemplate(
        "systems/shadowcity-blood-neon-vtt/templates/chat/npc-attack-roll-result.hbs",
        { roll: diceRoll, label: attack.name, rollRenderedHTML:rollRenderedHTML, attack: attack, rollDamageRenderedHTML: rollDamageRenderedHTML }
    );
    ChatMessage.create({
        content: html,
        speaker: ChatMessage.getSpeaker({ actor }),
    });
}