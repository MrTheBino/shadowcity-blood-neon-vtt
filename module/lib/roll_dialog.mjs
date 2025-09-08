import { ShadowCityDialog } from "./dialog.mjs";

export function addShowDicePromise(promises, roll) {
    if (game.dice3d) {
        // we pass synchronize=true so DSN dice appear on all players' screens
        promises.push(game.dice3d.showForRoll(roll, game.user, true, null, false));
    }
}

export async function rollDialogV1(actor, formula, label) {
    const cardTitle = label;
    if(parseInt(formula) < 0){
        formula = "1D20" + formula;
    }else{
        formula = "1D20+" + formula;
    }
    
    const dialogVars = {
        actor,
        formula,
        label
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
                    label: game.i18n.localize("SHADOWCITY.LABELS.Roll"),
                    callback: (event, button, dialog) => rollDialogV1Callback(event, button, dialog, actor),
                },
            ],
            default: "roll",
            close: () => resolve(null),
        }).render(true);
    });
}

async function rollDialogV1Callback(event, button, dialog, actor) {
    let dicePromises = [];
    const actorRollData = actor.getRollData();
    const form = button.form;
    console.log(form);
    const formula = form.formula.value;
    const rollLabel = form.label.value;

    const diceRoll = new Roll(formula, actorRollData);
    await diceRoll.evaluate();
    addShowDicePromise(dicePromises, diceRoll);
    await Promise.all(dicePromises);

    let rollRenderedHTML = await diceRoll.render();

    const html = await foundry.applications.handlebars.renderTemplate(
        "systems/shadowcity-blood-neon-vtt/templates/chat/roll-result.hbs",
        { roll: diceRoll, label: rollLabel, rollRenderedHTML:rollRenderedHTML }
    );
    ChatMessage.create({
        content: html,
        speaker: ChatMessage.getSpeaker({ actor }),
    });
}