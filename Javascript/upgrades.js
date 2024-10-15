import { upgradeTypes } from "./upgradeTypes.js";
import { stats, updateDisplay, saveGame } from "./engine.js";

export const upgrades = {
    clicker1: {
        title: "add on click pr click",
        cost: 135,
        initialCost: 135,
        type: "ADDITIVE",
        gives: 1,
        owned: 0,
        repeatable: false,
    },
    clicker1Boost: {
        title: "gib click gib more (1)",
        cost: 450,
        initialCost: 450,
        type: "MULTIPLICATIVE",
        gives: 2,
        owned: 0,
        repeatable: false,
        costIncrease: 1.5,
        affectedUpgrade: 'clicker1'
    },
    autoClicker: {
        title: "you want idle?",
        cost: 10,
        initialCost: 10,
        type: "PASSIVEBUILDING1",
        gives: () => 0.25,
        owned: 0,
        repeatable: true,
        costIncrease: 1.23,
    },
    offlineProgress: {
        title: "Offline Progress",
        cost: 100000,
        initialCost: 100000,
        type: "OFFLINE",
        gives: 0.5, // 50% of CPS while offline
        owned: 0,
        repeatable: false,
    },
    increaseAutoclicker:{
title: "upgrade autoclicker",
        cost: 1000,
        initialCost: 1000,
        type: "MULTIPLICATIVE",
        gives: () => 0.75, // 50% of CPS while offline
        owned: 0,
        repeatable: false,
    }
};

export function buyUpgrade(upgradeKey) {
    const upgrade = upgrades[upgradeKey];
    if (stats.clicks >= upgrade.cost) {
        stats.clicks -= upgrade.cost;
        if (typeof upgradeTypes[upgrade.type] === 'function') {
            upgradeTypes[upgrade.type](upgrade);
        } else {
            console.error(`Invalid upgrade type: ${upgrade.type}`);
        }
        if (!stats.upgradesOwned.includes(upgrade.title)) {
            stats.upgradesOwned.push(upgrade.title);
        }
        upgrade.owned++;
        if (upgrade.repeatable) {
            upgrade.cost = Math.floor(upgrade.cost * upgrade.costIncrease);
        }
        updateDisplay();
        saveGame();
    }
}

export function createUpgradeElements() {
    const upgradeArea = document.getElementById('upgradeArea');
    upgradeArea.innerHTML = '<h2 class="changeable" style="text-align: center;">Upgrades</h2>';

    const sortedUpgrades = sortUpgrades();
    
    sortedUpgrades.forEach(([key, upgrade]) => {
        if (upgrade.repeatable || upgrade.owned === 0) {
            const upgradeButton = document.createElement('button');
            upgradeButton.className = 'changeable';
            upgradeButton.id = `upgrade-${key}`;
            upgradeButton.onclick = () => buyUpgrade(key);
            upgradeArea.appendChild(upgradeButton);
        }
    });
    updateUpgradeButtons();
}

export function updateUpgradeButtons() {
    const sortedUpgrades = sortUpgrades();
    sortedUpgrades.forEach(([key, upgrade]) => {
        const upgradeButton = document.getElementById(`upgrade-${key}`);
        if (upgradeButton) {
            if (upgrade.repeatable || upgrade.owned === 0) {
                upgradeButton.innerHTML = `
                    Name: ${upgrade.title}<br>
                    ${upgrade.repeatable ? `Owned: ${upgrade.owned}<br>` : ''}
                    Gives: ${typeof upgrade.gives === 'function' ? upgrade.gives() : upgrade.gives}<br>
                    Costs: ${upgrade.cost.toFixed(2)}
                `;
                upgradeButton.disabled = stats.clicks < upgrade.cost;
                upgradeButton.style.display = stats.totalClicks >= upgrade.cost ? 'block' : 'none';
            } else {
                upgradeButton.remove();
            }
        }
    });
}

export function sortUpgrades() {
    return Object.entries(upgrades).sort((a, b) => a[1].cost - b[1].cost);
}

export function loadUpgrades(savedUpgrades) {
    // Reset stats that are affected by upgrades
    stats.amountPerClick = 1;
    stats.cps = 0;
    stats.offlineProgressRate = 0;

    for (let key in savedUpgrades) {
        if (upgrades[key]) {
            upgrades[key].owned = savedUpgrades[key].owned;
            upgrades[key].cost = savedUpgrades[key].cost;

            // Reapply the effect of each owned upgrade
            for (let i = 0; i < upgrades[key].owned; i++) {
                if (typeof upgradeTypes[upgrades[key].type] === 'function') {
                    upgradeTypes[upgrades[key].type](upgrades[key]);
                }
            }
        }
    }
}

export function recalculateUpgradeEffects() {
    // Reset stats that are affected by upgrades
    stats.amountPerClick = 1;
    stats.cps = 0;
    stats.offlineProgressRate = 0;

    // Reapply all upgrade effects
    for (let key in upgrades) {
        for (let i = 0; i < upgrades[key].owned; i++) {
            if (typeof upgradeTypes[upgrades[key].type] === 'function') {
                upgradeTypes[upgrades[key].type](upgrades[key]);
            }
        }
    }

    updateDisplay();
}
