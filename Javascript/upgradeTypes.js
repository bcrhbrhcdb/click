import { stats } from "./engine.js";
// add to click amount 
export const upgradeTypes = {
     ADDITIVE:  (upgrade) => {
        stats.amountPerClick += upgrade.gives;
    },
}
