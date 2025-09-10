export function abilityModifier(ability) {
    let t = ability.mod_value;
    if (ability.bloodboost) {
        t += 2;
        if (t > 7) t = 7;
    } else {
        if (t > 5) t = 5;
    }

    if (t < -4) t = -4;
    return t;
}