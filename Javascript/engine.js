import { upgrades, buyUpgrade, createUpgradeElements, updateUpgradeButtons, sortUpgrades, loadUpgrades } from "./upgrades.js";
import { saveData } from './save.js';
import { recalculateUpgradeEffects } from "./upgrades.js";
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
        recalculateUpgradeEffects(); // Add this line
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
        alert(`Welcome back! You were gone for ${timeString} and earned ${progress.toFixed(2)} clicks at 50% power  while away.`);
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
            cpsValue.textContent = Number(stats.cps).toFixed(3);
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
        stats.offlineProgressRate = 0;

        for (let key in upgrades) {
            upgrades[key].owned = 0;
            upgrades[key].cost = upgrades[key].initialCost;
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
        version: "0.1.0" // Add a version number to your save file
    };
    
    const saveString = btoa(JSON.stringify(gameState)); // Encode the save data
    
    // Create a Blob with the save data
    const blob = new Blob([saveString], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
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
                const gameState = JSON.parse(atob(saveString)); // Decode and parse the save data
                
                // Verify the save file version
                if (gameState.version !== "0.1.0") {
                    throw new Error("Incompatible save file version");
                }
                
                // Validate and sanitize the imported data
                if (gameState.stats && gameState.upgrades) {
                    // Reset the game state
                    stats.clicks = 0;
                    stats.totalClicks = 0;
                    stats.amountPerClick = 1;
                    stats.upgradesOwned = [];
                    stats.cps = 0;
                    stats.offlineProgressRate = 0;
                    
                    // Apply the imported stats (with validation)
                    stats.clicks = Math.max(0, Number(gameState.stats.clicks) || 0);
                    stats.totalClicks = Math.max(0, Number(gameState.stats.totalClicks) || 0);
                    stats.lastSaveTime = Date.now();
                    
                    // Load upgrades
                    loadUpgrades(gameState.upgrades);
                    
                    // Recalculate all upgrade effects
                    recalculateUpgradeEffects();
                    
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

// ... (existing code)

export function initGame() {
    loadGame();
    stats.cps = Number(stats.cps);
    stats.offlineProgressRate = Number(stats.offlineProgressRate);
    createUpgradeElements();
    recalculateUpgradeEffects();
    updateDisplay();
    startGameTick();
    startAutoSave();
    
    // Add event listeners for export and import buttons
    document.getElementById("exportSave").addEventListener("click", exportSave);
    document.getElementById("importSave").addEventListener("click", () => {
        document.getElementById("importFile").click();
    });
    document.getElementById("importFile").addEventListener("change", importSave);
}
