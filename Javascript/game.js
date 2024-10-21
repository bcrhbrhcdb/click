import { 
    clickButton, 
    addClicks, 
    updateDisplay, 
    resetGame, 
    initGame, 
    saveGame, 
    exportSave, 
    importSave 
} from "./engine.js";
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

// Add export and import functionality
const exportButton = document.getElementById("exportSave");
if (exportButton) {
    exportButton.addEventListener("click", exportSave);
}

const importButton = document.getElementById("importSave");
const importFile = document.getElementById("importFile");
if (importButton && importFile) {
    importButton.addEventListener("click", () => {
        importFile.click();
    });
    importFile.addEventListener("change", importSave);
}

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent scrolling
        clickButton.click();
    }
});

// Add auto-click functionality (optional)
let autoClickInterval;
export function startAutoClick(interval = 1000) {
    if (!autoClickInterval) {
        autoClickInterval = setInterval(() => {
            clickButton.click();
        }, interval);
    }
}

export function stopAutoClick() {
    if (autoClickInterval) {
        clearInterval(autoClickInterval);
        autoClickInterval = null;
    }
}

// You can add more game-specific logic here