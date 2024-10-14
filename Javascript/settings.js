import { saveData } from "./save.js";
import { stats, updateDisplay } from "./engine.js";
import { upgrades } from "./upgrades.js";

// Use querySelector instead of getElementById for more flexibility
const openSettings = document.querySelector("#settings");
const resetButton = document.querySelector("#resetGame");
const settingArea = document.querySelector("#settingsArea");
const showStat = document.getElementById("stats");
function openSettingArea() {
    if (settingArea) {
        if (settingArea.style.display === "block") {
            settingArea.style.display = "none";
            openSettings.innerText = "Open Settings";
        } else {
            settingArea.style.display = "block";
            openSettings.innerText = "Close Settings";
        }
    } else {
        console.error("Settings area not found in the DOM");
    }
}

function resetGame() {
    // Clear all saved data
    saveData.delete('gameState');

    // Reload the page
    window.location.reload();
}

// Check if elements exist before adding event listeners
if (openSettings) {
    openSettings.addEventListener("click", openSettingArea);
} else {
    console.error("Open settings button not found in the DOM");
}

if (resetButton) {
    resetButton.addEventListener("click", resetGame);
} else {
    console.error("Reset button not found in the DOM");
}


// Initialize settings when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!openSettings) {
        console.error("Open settings button not found in the DOM");
    }
    if (!resetButton) {
        console.error("Reset button not found in the DOM");
    }
    if (!settingArea) {
        console.error("Settings area not found in the DOM");
    }
});
function showStats(){
    showStat.style.display = "block";
};
showStat.addEventListener("click", showStats);