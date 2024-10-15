import { stats } from "./engine.js";

// Assuming amountPerClickDisplay is a global variable or DOM element
// If it's not, you might need to import it or select it within each function

export const upgradeTypes = {
    ADDITIVE: (upgrade) => {
        stats.amountPerClick += upgrade.gives;
        amountPerClickDisplay.innerText = stats.amountPerClick.toFixed(2);
    },
    MULTIPLICATIVE: (upgrade) => {
        if (upgrade.affectedUpgrade) {
            const affectedUpgrade = upgrades[upgrade.affectedUpgrade];
            if (affectedUpgrade) {
                affectedUpgrade.gives *= upgrade.gives;
                stats.amountPerClick = stats.amountPerClick * upgrade.gives;
            } else {
                console.error(`Affected upgrade ${upgrade.affectedUpgrade} not found`);
            }
        } else {
            stats.amountPerClick *= upgrade.gives;
        }
        amountPerClickDisplay.innerText = stats.amountPerClick.toFixed(2);
    }
};