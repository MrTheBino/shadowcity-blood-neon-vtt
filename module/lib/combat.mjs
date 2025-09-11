import { addShowDicePromise } from "./roll_dialog.mjs";

export class ShadowCityCombat extends Combat {
    async rollInitiative(ids, options = {}) {

        const updates = [];
        const dicePromises = [];
        const label = game.i18n.format("SHADOWCITY.LABELS.initiativeRoll");

        for (const id of ids) {
            const combatant = this.combatants.get(id, { strict: true });

            const actorRollData = combatant.actor.getRollData();
            const rollFormula = `1d20+${combatant.actor.system.abilities.quickness.mod_value}`;
            const diceRoll = new Roll(rollFormula, actorRollData);
            await diceRoll.evaluate();
            addShowDicePromise(dicePromises, diceRoll);

            
            const updateData = {
                initiative: diceRoll.total
            };
            updates.push({ _id: combatant.id, ...updateData });
            
            let rollRenderedHTML = await diceRoll.render();
            const html = await foundry.applications.handlebars.renderTemplate(
                "systems/shadowcity-blood-neon-vtt/templates/chat/initiative-roll-result.hbs",
                { roll: diceRoll, label: label,rollRenderedHTML:rollRenderedHTML }
            );

            ChatMessage.create({
                content: html,
                speaker: ChatMessage.getSpeaker({ actor: combatant.actor }),
            });

        } // each ids

        await Promise.all(dicePromises);
        // Updates the combatants.
        await this.updateEmbeddedDocuments('Combatant', updates);
        return this;
    }
}