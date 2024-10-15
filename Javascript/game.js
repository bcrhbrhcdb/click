import { clickButton, addClicks, updateDisplay, resetGame, initGame, saveGame } from "./engine.js";

clickButton.addEventListener("click", () => {
    addClicks();
    updateDisplay();
    saveGame();
});

// Call initGame when the page loads
window.addEventListener('load', initGame);

// Add reset button functionality
const resetButton = document.getElementById("resetGame");
if (resetButton) {
    resetButton.addEventListener("click", resetGame);
}