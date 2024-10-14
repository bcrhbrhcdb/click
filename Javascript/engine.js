import { upgrades, buyUpgrade } from "./upgrades.js"
import { saveData } from './save.js';
export const stats = {
    clicks: 0,
    totalClicks: 0,
    amountPerClick: 1,
    upgradesOwned: [],
    cps: 0,
};

export const clickButton = document.getElementById("click-button");
export const clicks = document.getElementById("clicks");
export const totalClicks = document.getElementById("total-clicks");

export function addClicks() {
    stats.clicks += stats.amountPerClick;
    stats.totalClicks += stats.amountPerClick;
    clicks.innerText = stats.clicks;
    totalClicks.innerText = stats.totalClicks;
    console.log(`Clicks: ${stats.clicks} | Total Clicks: ${stats.totalClicks}`);
    saveGame(); // Save after each click
};


export function upgradeLogic(){
    const upgradeArea = document.getElementById("upgradeArea");
    upgradeArea.innerHTML = ''; // Clear existing upgrades

    for (let key in upgrades) {
        const upgrade = upgrades[key];
        if(stats.totalClicks >= upgrade.cost && (upgrade.repeatable || upgrade.owned === 0)){
            const upgradeButton = document.createElement('button');
            upgradeButton.className = 'upgrade';
            upgradeButton.id = `upgrade-${key}`;
            upgradeButton.innerHTML = `
                Name: ${upgrade.title}<br>
                ${upgrade.repeatable ? `Owned: ${upgrade.owned}<br>` : ''}
                Gives: ${upgrade.gives}<br>
                Costs: ${upgrade.cost}
            `;
            upgradeButton.onclick = () => {
                buyUpgrade(upgrade);
                updateDisplay();
                saveGame();
            };
            upgradeArea.appendChild(upgradeButton);
        }
    }
}

export function saveGame() {
    saveData.save('gameState', stats);
};

export function loadGame() {
    const savedStats = saveData.load('gameState');
    if (savedStats) {
        Object.assign(stats, savedStats);
        updateDisplay();
    };
};

export function updateDisplay() {
    clicks.innerText = stats.clicks;
    totalClicks.innerText = stats.totalClicks;
    upgradeLogic(); // Call upgradeLogic to update available upgrades
};