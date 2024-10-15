import { upgrades, buyUpgrade, createUpgradeElements, updateUpgradeButtons } from "./upgrades.js";
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

const TICKS_PER_SECOND = 20;
const TICK_INTERVAL = 1000 / TICKS_PER_SECOND;
const SAVE_INTERVAL = 60000; // Save every minute

let gameTickInterval;

export function addClicks(amount = stats.amountPerClick) {
    stats.clicks += amount;
    stats.totalClicks += amount;
    updateDisplay();
}

export function upgradeLogic() {
    const upgradeArea = document.getElementById("upgradeArea");
    if (!upgradeArea.querySelector('h2')) {
        upgradeArea.innerHTML = '<h2 class="changeable" style="text-align: center;">Upgrades</h2>';
    }

    for (let key in upgrades) {
        const upgrade = upgrades[key];
        let upgradeButton = document.getElementById(`upgrade-${key}`);
        
        if (!upgradeButton && (upgrade.repeatable || upgrade.owned === 0)) {
            upgradeButton = document.createElement('button');
            upgradeButton.className = 'changeable';
            upgradeButton.id = `upgrade-${key}`;
            upgradeButton.onclick = () => buyUpgrade(key);
            upgradeArea.appendChild(upgradeButton);
        }
        
        if (upgradeButton) {
            upgradeButton.innerHTML = `
                Name: ${upgrade.title}<br>
                ${upgrade.repeatable ? `Owned: ${upgrade.owned}<br>` : ''}
                Gives: ${upgrade.gives}<br>
                Costs: ${upgrade.cost.toFixed(2)}
            `;
            upgradeButton.style.display = stats.totalClicks >= upgrade.cost ? 'block' : 'none';
        }
    }
}

export function saveGame() {
    const gameState = {
        stats: stats,
        upgrades: upgrades
    };
    saveData.save('gameState', gameState);
}

export function loadGame() {
    const savedState = saveData.load('gameState');
    if (savedState) {
        Object.assign(stats, savedState.stats);
        Object.assign(upgrades, savedState.upgrades);
        updateDisplay();
    }
}

export function updateDisplay() {
    clicks.innerText = stats.clicks.toFixed(2);
    totalClicks.innerText = stats.totalClicks.toFixed(2);
    const amountPerClickDisplay = document.getElementById("amountPerClick");
    if (amountPerClickDisplay) {
        amountPerClickDisplay.innerText = stats.amountPerClick.toFixed(2);
    }
    const cpsDisplay = document.getElementById("cpsDisplay");
    const cpsValue = document.getElementById("cPS");
    if (cpsDisplay && cpsValue) {
        if (stats.cps > 0) {
            cpsDisplay.style.display = "block";
            cpsValue.textContent = stats.cps.toFixed(1);
        } else {
            cpsDisplay.style.display = "none";
        }
    }
    updateUpgradeButtons();
    upgradeLogic();
}

function gameTick() {
    const clicksToAdd = stats.cps / TICKS_PER_SECOND;
    addClicks(clicksToAdd);
    updateDisplay();
}

export function startGameTick() {
    gameTickInterval = setInterval(gameTick, TICK_INTERVAL);
}

export function stopGameTick() {
    clearInterval(gameTickInterval);
}

export function startAutoSave() {
    setInterval(saveGame, SAVE_INTERVAL);
}

export function resetGame() {
    if (confirm("Are you sure you want to reset the game? All progress will be lost.")) {
        stopGameTick();
        stats.clicks = 0;
        stats.totalClicks = 0;
        stats.amountPerClick = 1;
        stats.upgradesOwned = [];
        stats.cps = 0;

        for (let key in upgrades) {
            upgrades[key].owned = 0;
            upgrades[key].cost = upgrades[key].initialCost;
        }

        updateDisplay();
        saveGame();
        startGameTick();
    }
}

export function initGame() {
    loadGame();
    createUpgradeElements();
    updateDisplay();
    startGameTick();
    startAutoSave();
}