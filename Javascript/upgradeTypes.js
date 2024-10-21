import { stats } from "./engine.js";
import { upgrades } from "./upgrades.js";
import { buildings } from "./buildings.js";

export const upgradeTypes = {
    ADDITIVE: (upgrade) => {
        stats.amountPerClick += upgrade.gives;
    },
    MULTIPLICATIVE: (upgrade) => {
        if (upgrade.affectedUpgrade) {
            const affectedUpgrade = upgrades[upgrade.affectedUpgrade];
            if (affectedUpgrade) {
                affectedUpgrade.gives *= upgrade.gives;
                stats.amountPerClick *= upgrade.gives;
            } else {
                console.error(`Affected upgrade ${upgrade.affectedUpgrade} not found`);
            }
        } else {
            stats.amountPerClick *= upgrade.gives;
        }
    },
    BUILDING_BOOST: (upgrade) => {
        if (upgrade.affectedBuilding) {
            const affectedBuilding = buildings[upgrade.affectedBuilding];
            if (affectedBuilding) {
                affectedBuilding.production *= upgrade.gives;
                stats.cps = Object.values(buildings).reduce((sum, building) => sum + building.production * building.owned, 0);
            } else {
                console.error(`Affected building ${upgrade.affectedBuilding} not found`);
            }
        } else {
            console.error("BUILDING_BOOST upgrade type requires an affectedBuilding property");
        }
    },
    OFFLINE: (upgrade) => {
        stats.offlineProgressRate = upgrade.gives;
    }
};