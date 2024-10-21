import { buildingTypes } from "./buildingTypes.js";
import { stats, updateDisplay, saveGame } from "./engine.js";
import { applyThemeToElement } from "./settings.js";

export const buildings = {
    autoClicker: {
        title: "Auto Clicker",
        cost: 100,
        initialCost: 100,
        type: "PASSIVE",
        production: 0.5,
        owned: 0,
        repeatable: true,
        costIncrease: 1.15,
        unlockAt: 100
    },
    farm: {
        title: "Click Farm",
        cost: 50,
        initialCost: 50,
        type: "PASSIVE",
        production: 0.5,
        owned: 0,
        repeatable: true,
        costIncrease: 1.2,
        unlockAt: 500
    },
    factory: {
        title: "Click Factory",
        cost: 200,
        initialCost: 200,
        type: "PASSIVE",
        production: 2,
        owned: 0,
        repeatable: true,
        costIncrease: 1.25,
        unlockAt: 2000
    },
    mine: {
        title: "Click Mine",
        cost: 1000,
        initialCost: 1000,
        type: "PASSIVE",
        production: 10,
        owned: 0,
        repeatable: true,
        costIncrease: 1.3,
        unlockAt: 10000
    },
    clickMultiplier: {
        title: "Click Multiplier",
        cost: 5000,
        initialCost: 5000,
        type: "MULTIPLIER",
        multiplier: 1.5,
        owned: 0,
        repeatable: false,
        unlockAt: 50000
    }
};

export function buyBuilding(buildingKey) {
    const building = buildings[buildingKey];
    if (stats.clicks >= building.cost) {
        stats.clicks -= building.cost;
        if (typeof buildingTypes[building.type] === 'function') {
            buildingTypes[building.type](building);
        } else {
            console.error(`Invalid building type: ${building.type}`);
        }
        building.owned++;
        if (building.repeatable) {
            building.cost = Math.floor(building.cost * building.costIncrease);
        }
        updateDisplay();
        saveGame();
    }
}

export function createBuildingElements() {
    const buildingArea = document.getElementById('buildingArea');
    buildingArea.innerHTML = '<h2 class="changeable" style="text-align: center;">Buildings</h2>';

    const sortedBuildings = sortBuildings();
    
    sortedBuildings.forEach(([key, building]) => {
        if (building.repeatable || building.owned === 0) {
            const buildingButton = document.createElement('button');
            buildingButton.className = 'changeable';
            buildingButton.id = `building-${key}`;
            buildingButton.onclick = () => buyBuilding(key);
            buildingArea.appendChild(buildingButton);
            applyThemeToElement(buildingButton, localStorage.getItem('currentTheme') || 'light');
        }
    });
    updateBuildingButtons();
}

export function updateBuildingButtons() {
    const sortedBuildings = sortBuildings();
    sortedBuildings.forEach(([key, building]) => {
        const buildingButton = document.getElementById(`building-${key}`);
        if (buildingButton) {
            if (building.repeatable || building.owned === 0) {
                buildingButton.className = 'changeable';
                buildingButton.innerHTML = `
                    <div style="text-align: center;">
                        Name: ${building.title}<br>
                        Owned: ${building.owned}<br>
                        Production: ${building.production || building.multiplier}<br>
                        Costs: ${building.cost.toFixed(2)}
                    </div>
                `;
                buildingButton.disabled = stats.clicks < building.cost;
                buildingButton.style.display = stats.totalClicks >= building.unlockAt ? 'block' : 'none';
            } else {
                buildingButton.remove();
            }
        }
    });
}

export function sortBuildings() {
    return Object.entries(buildings).sort((a, b) => a[1].cost - b[1].cost);
}

export function loadBuildings(savedBuildings) {
    for (let key in savedBuildings) {
        if (buildings[key]) {
            buildings[key].owned = savedBuildings[key].owned;
            buildings[key].cost = savedBuildings[key].cost;
        }
    }
}

export function recalculateBuildingEffects() {
    stats.cps = 0;
    for (let key in buildings) {
        const building = buildings[key];
        if (building.type === "PASSIVE") {
            stats.cps += building.production * building.owned;
        } else if (building.type === "MULTIPLIER") {
            stats.cps *= Math.pow(building.multiplier, building.owned);
        }
    }
    updateDisplay();
}