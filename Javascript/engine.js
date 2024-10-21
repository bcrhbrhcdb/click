import { upgrades, buyUpgrade, createUpgradeElements, updateUpgradeButtons, sortUpgrades, loadUpgrades, recalculateUpgradeEffects } from "./upgrades.js";
import { buildings, buyBuilding, createBuildingElements, updateBuildingButtons, sortBuildings, loadBuildings, recalculateBuildingEffects } from "./buildings.js";
import { saveData } from './save.js';
import { applyThemeToElement } from './settings.js';

export const stats = {
    clicks: 0,
    totalClicks: 0,
    amountPerClick: 1,
    upgradesOwned: [],
    cps: 0,
    offlineProgressRate: 0,
    lastSaveTime: Date.now()
};

export const clickButton = document.getElementById("click-button");
export const clicks = document.getElementById("clicks");
export const totalClicks = document.getElementById("total-clicks");

const TICKS_PER_SECOND = 25;
const TICK_INTERVAL = 1000 / TICKS_PER_SECOND;
const SAVE_INTERVAL = 10000; // Save every 10 seconds

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

    const sortedUpgrades = sortUpgrades();
    
    sortedUpgrades.forEach(([key, upgrade]) => {
        let upgradeButton = document.getElementById(`upgrade-${key}`);
        
        if (!upgradeButton && (upgrade.repeatable || upgrade.owned === 0)) {
            upgradeButton = document.createElement('button');
            upgradeButton.className = 'changeable';
            upgradeButton.id = `upgrade-${key}`;
            upgradeButton.onclick = () => buyUpgrade(key);
            upgradeArea.appendChild(upgradeButton);
            applyThemeToElement(upgradeButton, localStorage.getItem('currentTheme') || 'light');
        }
        
        if (upgradeButton) {
            if (upgrade.repeatable || upgrade.owned === 0) {
                upgradeButton.innerHTML = `
                    Name: ${upgrade.title}<br>
                    ${upgrade.repeatable ? `Owned: ${upgrade.owned}<br>` : ''}
                    Gives: ${typeof upgrade.gives === 'function' ? upgrade.gives() : upgrade.gives}<br>
                    Costs: ${upgrade.cost.toFixed(2)}
                `;
                upgradeButton.style.display = stats.totalClicks >= upgrade.cost ? 'block' : 'none';
            } else {
                upgradeButton.remove();
            }
        }
    });
}

export function buildingLogic() {
    const buildingArea = document.getElementById("buildingArea");
    if (!buildingArea.querySelector('h2')) {
        buildingArea.innerHTML = '<h2 class="changeable" style="text-align: center;">Buildings</h2>';
    }

    const sortedBuildings = sortBuildings();
    
    sortedBuildings.forEach(([key, building]) => {
        let buildingButton = document.getElementById(`building-${key}`);
        
        if (!buildingButton && (building.repeatable || building.owned === 0)) {
            buildingButton = document.createElement('button');
            buildingButton.className = 'changeable';
            buildingButton.id = `building-${key}`;
            buildingButton.onclick = () => buyBuilding(key);
            buildingArea.appendChild(buildingButton);
            applyThemeToElement(buildingButton, localStorage.getItem('currentTheme') || 'light');
        }
        
        if (buildingButton) {
            if (building.repeatable || building.owned === 0) {
                buildingButton.innerHTML = `
                    <div class="changeable" style="text-align: center;">
                        Name: ${building.title}<br>
                        Owned: ${building.owned}<br>
                        Production: ${building.production || building.multiplier}<br>
                        Costs: ${building.cost.toFixed(2)}
                    </div>
                `;
                buildingButton.style.display = stats.totalClicks >= building.unlockAt ? 'block' : 'none';
            } else {
                buildingButton.remove();
            }
        }
    });
}

export function saveGame() {
    const gameState = {
        stats: stats,
        upgrades: Object.fromEntries(
            Object.entries(upgrades).map(([key, upgrade]) => [
                key,
                {
                    owned: upgrade.owned,
                    cost: upgrade.cost,
                    gives: typeof upgrade.gives === 'function' ? upgrade.gives() : upgrade.gives
                }
            ])
        ),
        buildings: Object.fromEntries(
            Object.entries(buildings).map(([key, building]) => [
                key,
                {
                    owned: building.owned,
                    cost: building.cost,
                    production: building.production
                }
            ])
        )
    };
    saveData.save('gameState', gameState);
    stats.lastSaveTime = Date.now();
}

export function loadGame() {
    const savedState = saveData.load('gameState');
    if (savedState) {
        Object.assign(stats, savedState.stats);
        loadUpgrades(savedState.upgrades);
        loadBuildings(savedState.buildings);
        recalculateUpgradeEffects();
        recalculateBuildingEffects();
        const currentTime = Date.now();
        const timeDiff = currentTime - stats.lastSaveTime;
        if (timeDiff > 0 && stats.offlineProgressRate > 0) {
            const offlineProgress = (stats.cps * stats.offlineProgressRate * timeDiff) / 1000;
            stats.clicks += offlineProgress;
            stats.totalClicks += offlineProgress;
            showOfflineProgressPopup(offlineProgress, timeDiff);
        }
        updateDisplay();
    }
}

function showOfflineProgressPopup(progress, time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const timeString = `${hours}h ${minutes}m ${seconds}s`;
    
    if (progress > 0) {
        alert(`Welcome back! You were gone for ${timeString} and earned ${progress.toFixed(2)} clicks at 50% power while away.`);
    }
}

export function updateDisplay() {
    clicks.innerText = Number(stats.clicks).toFixed(2);
    totalClicks.innerText = Number(stats.totalClicks).toFixed(2);
    const amountPerClickDisplay = document.getElementById("amountPerClick");
    if (amountPerClickDisplay) {
        amountPerClickDisplay.innerText = Number(stats.amountPerClick).toFixed(2);
    }
    const cpsDisplay = document.getElementById("cpsDisplay");
    const cpsValue = document.getElementById("cPS");
    if (cpsDisplay && cpsValue) {
        if (stats.cps > 0) {
            cpsDisplay.style.display = "block";
            cpsValue.textContent = Number(stats.cps).toFixed(2);
        } else {
            cpsDisplay.style.display = "none";
        }
    }
    updateUpgradeButtons();
    updateBuildingButtons();
    upgradeLogic();
    buildingLogic();
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
        stats.offlineProgressRate = 0;

        for (let key in upgrades) {
            upgrades[key].owned = 0;
            upgrades[key].cost = upgrades[key].initialCost;
        }

        for (let key in buildings) {
            buildings[key].owned = 0;
            buildings[key].cost = buildings[key].initialCost;
        }

        updateDisplay();
        saveGame();
        startGameTick();
    }
}

export function exportSave() {
    const gameState = {
        stats: stats,
        upgrades: Object.fromEntries(
            Object.entries(upgrades).map(([key, upgrade]) => [
                key,
                {
                    owned: upgrade.owned,
                    cost: upgrade.cost
                }
            ])
        ),
        buildings: Object.fromEntries(
            Object.entries(buildings).map(([key, building]) => [
                key,
                {
                    owned: building.owned,
                    cost: building.cost
                }
            ])
        ),
        version: "0.1.0"
    };
    
    const saveString = btoa(JSON.stringify(gameState));
    const blob = new Blob([saveString], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "click_save.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function importSave(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const saveString = e.target.result;
                const gameState = JSON.parse(atob(saveString));
                
                if (gameState.version !== "0.1.0") {
                    throw new Error("Incompatible save file version");
                }
                
                if (gameState.stats && gameState.upgrades && gameState.buildings) {
                    stats.clicks = 0;
                    stats.totalClicks = 0;
                    stats.amountPerClick = 1;
                    stats.upgradesOwned = [];
                    stats.cps = 0;
                    stats.offlineProgressRate = 0;
                    
                    stats.clicks = Math.max(0, Number(gameState.stats.clicks) || 0);
                    stats.totalClicks = Math.max(0, Number(gameState.stats.totalClicks) || 0);
                    stats.lastSaveTime = Date.now();
                    
                    loadUpgrades(gameState.upgrades);
                    loadBuildings(gameState.buildings);
                    
                    recalculateUpgradeEffects();
                    recalculateBuildingEffects();
                    
                    updateDisplay();
                    saveGame();
                    alert("Save file imported successfully!");
                } else {
                    throw new Error("Invalid save file structure");
                }
            } catch (error) {
                console.error("Error importing save:", error);
                alert("Error importing save file. Please make sure it's a valid save file.");
            }
        };
        reader.readAsText(file);
    }
}

export function initGame() {
    loadGame();
    stats.cps = Number(stats.cps);
    stats.offlineProgressRate = Number(stats.offlineProgressRate);
    createUpgradeElements();
    createBuildingElements();
    recalculateUpgradeEffects();
    recalculateBuildingEffects();
    updateDisplay();
    startGameTick();
    startAutoSave();
    
    document.getElementById("exportSave").addEventListener("click", exportSave);
    document.getElementById("importSave").addEventListener("click", () => {
        document.getElementById("importFile").click();
    });
    document.getElementById("importFile").addEventListener("change", importSave);
}