import { stats, clicks, clickButton, addClicks, totalClicks, loadGame, updateDisplay } from "./engine.js";

clickButton.addEventListener("click", () => {
    addClicks();
    updateDisplay();
});

// Initialize game
function initGame() {
    loadGame();
    updateDisplay();
}

// Call initGame when the page loads
window.addEventListener('load', initGame);