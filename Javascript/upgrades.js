import { upgradeTypes } from "./upgradeTypes.js";
import { stats } from "./engine.js"

export const upgrades = {
    clicker1: {
        title: "gib click",
        cost: 50,
        type: upgradeTypes.ADDITIVE,
        gives: 1,
        owned: 0,
        costIncrease: 1.324,
        repeatable: true, // Add this line
    }
}
export function buyUpgrade(upgrade){
    if (stats.clicks >= upgrade.cost) {
        stats.clicks -= upgrade.cost;
        stats.amountPerClick += upgrade.gives;
        if (!stats.upgradesOwned.includes(upgrade.title)) {
            stats.upgradesOwned.push(upgrade.title);
        }
        upgrade.owned++;
        if (upgrade.repeatable) {
            upgrade.cost = Math.floor(upgrade.cost * upgrade.costIncrease);
        }
    }
}