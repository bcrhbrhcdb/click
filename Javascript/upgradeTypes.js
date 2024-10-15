import { stats } from "./engine.js";

export const upgradeTypes = {
    ADDITIVE: (upgrade) => {
        stats.amountPerClick += upgrade.gives;
        const amountPerClickDisplay = document.getElementById("amountPerClick");
        if (amountPerClickDisplay) {
            amountPerClickDisplay.innerText = stats.amountPerClick.toFixed(2);
        }
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
        const amountPerClickDisplay = document.getElementById("amountPerClick");
        if (amountPerClickDisplay) {
            amountPerClickDisplay.innerText = stats.amountPerClick.toFixed(2);
        }
    },
    PASSIVEBUILDING1: (upgrade) => {
        stats.cps += upgrade.gives;
        const cpsDisplay = document.getElementById("cpsDisplay");
        const cpsValue = document.getElementById("cPS");
        if (cpsDisplay && cpsValue) {
            cpsDisplay.style.display = "block";
            cpsValue.textContent = stats.cps.toFixed(1);
        } else {
            console.error("CPS display elements not found");
        }
    },
    OFFLINEPROGRESS: (upgrade)=>{
        
    }
};