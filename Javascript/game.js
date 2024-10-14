import { stats, clicks, clickButton, addClicks, totalClicks } from "Javascript/engine.js";

export function updateDisplay() {
    clicks.innerText = stats.clicks;
    totalClicks.innerText = stats.totalClicks;
}

clickButton.addEventListener("click", () => {
    addClicks();
    updateDisplay();
});

// Initialize display
updateDisplay();