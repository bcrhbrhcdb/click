import { stats } from "./engine.js";
// add to click amount 
export const upgradeTypes = {
     ADDITIVE:  (upgrade) => {
        const amountPerClickDisplay = document.getElementById("amountPerClick");
        stats.amountPerClick += upgrade.gives;
        amountPerClickDisplay.innerText += stats.amountPerClick
    },
}
