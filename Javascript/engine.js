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
};