import { upgradeTypes } from "./upgradeTypes.js";
import { stats, updateDisplay, saveGame } from "./engine.js";

export const upgrades = {
    clicker1: {
        title: "add on click pr click",
        cost: 135,
        initialCost: 135,
        type: upgradeTypes.ADDITIVE,
        gives: 1,
        owned: 0,
        repeatable: false,
    },
    clicker1Boost: {
        title: "gib click gib more (1)",
        cost: 450,
        initialCost: 450,
        type: upgradeTypes.MULTIPLICATIVE,
        gives: 1,
        owned: 0,
        repeatable: false,
        costIncrease: 1.5,
        affectedUpgrade: 'clicker1'
    },
    autoClicker: {
        title: "you want idle?",
        cost: 20,
        initialCost: 20,
        type: upgradeTypes.PASSIVEBUILDING1,
        gives: 0.2,
        owned: 0,
        repeatable: true,
        costIncrease: 1.23,
    }
};

export function buyUpgrade(upgradeKey) {
    const upgrade = upgrades[upgradeKey];
    if (stats.clicks >= upgrade.cost) {
        stats.clicks -= upgrade.cost;
        upgrade.type(upgrade);
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

    Object.entries(upgrades).forEach(([key, upgrade]) => {
        const upgradeButton = document.createElement('button');
        upgradeButton.className = 'changeable';
        upgradeButton.id = `upgrade-${key}`;
        upgradeButton.innerHTML = `
            Name: ${upgrade.title}<br>
            ${upgrade.repeatable ? `Owned: ${upgrade.owned}<br>` : ''}
            Gives: ${upgrade.gives}<br>
            Costs: ${upgrade.cost.toFixed(2)}
        `;
        upgradeButton.onclick = () => buyUpgrade(key);
        upgradeArea.appendChild(upgradeButton);
    });
    updateUpgradeButtons();
}

export function updateUpgradeButtons() {
    Object.entries(upgrades).forEach(([key, upgrade]) => {
        const upgradeButton = document.getElementById(`upgrade-${key}`);
        if (upgradeButton) {
            upgradeButton.innerHTML = `
                Name: ${upgrade.title}<br>
                ${upgrade.repeatable ? `Owned: ${upgrade.owned}<br>` : ''}
                Gives: ${upgrade.gives}<br>
                Costs: ${upgrade.cost.toFixed(2)}
            `;
            upgradeButton.disabled = stats.clicks < upgrade.cost;
        }
    });
}