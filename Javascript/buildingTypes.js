import { stats } from "./engine.js";
import { buildings } from "./buildings.js";

export const buildingTypes = {
    PASSIVE: (building) => {
        stats.cps += building.production;
        const cpsDisplay = document.getElementById("cpsDisplay");
        const cpsValue = document.getElementById("cPS");
        if (cpsDisplay && cpsValue) {
            cpsDisplay.style.display = "block";
            cpsValue.textContent = Number(stats.cps).toFixed(2);
        } else {
            console.error("CPS display elements not found");
        }
    },
    MULTIPLIER: (building) => {
        if (building.affectedBuilding) {
            const affectedBuilding = buildings[building.affectedBuilding];
            if (affectedBuilding) {
                affectedBuilding.production *= building.multiplier;
                stats.cps *= building.multiplier;
            } else {
                console.error(`Affected building ${building.affectedBuilding} not found`);
            }
        } else {
            stats.cps *= building.multiplier;
        }
        const cpsValue = document.getElementById("cPS");
        if (cpsValue) {
            cpsValue.innerText = stats.cps.toFixed(2);
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
    }
};