import { saveData } from "./save.js";
import { stats, updateDisplay } from "./engine.js";
import { upgrades } from "./upgrades.js";

// DOM Elements
const openStats = document.querySelector("#openStats");
const openSettings = document.querySelector("#settings");
const resetButton = document.querySelector("#resetGame");
const settingArea = document.querySelector("#settingsArea");
const showStat = document.querySelector("#statArea");
const themeSwitcher = document.querySelector("#switchTheme");

// Theme definitions
const themes = {
    light: {
        body: { backgroundColor: '#ffffff', color: '#000000' },
        button: { backgroundColor: '#f0f0f0', color: '#000000' },
        text: { color: '#000000' }
    },
    dark: {
        body: { backgroundColor: '#1a1a1a', color: '#ffffff' },
        button: { backgroundColor: '#333333', color: '#ffffff' },
        text: { color: '#ffffff' }
    },
    noob: {
        body: { backgroundColor: 'red', color: 'white' },
        button: { backgroundColor: 'blue', color: 'white' },
        text: { color: 'yellow' }
    },
    discord: {
        body: { backgroundColor: '#36393f', color: '#dcddde' },
        button: { backgroundColor: '#4e5d94', color: '#ffffff' },
        text: { color: '#dcddde' }
    }
};

// Functions
function toggleSettingArea() {
    if (settingArea) {
        const isHidden = settingArea.style.display === "none" || settingArea.style.display === "";
        settingArea.style.display = isHidden ? "block" : "none";
        openSettings.innerText = isHidden ? "Close Settings" : "Open Settings";
    } else {
        console.error("Settings area not found in the DOM");
    }
}

function resetGame() {
    if (confirm("Are you sure you want to reset the game? All progress will be lost.")) {
        saveData.delete('gameState');
        window.location.reload();
    }
}

function toggleStats() {
    if (showStat) {
        const isHidden = showStat.style.display === "none" || showStat.style.display === "";
        showStat.style.display = isHidden ? "block" : "none";
        openStats.innerText = isHidden ? "Close Stats" : "Open Stats";
    } else {
        console.error("Stats area not found in the DOM");
    }
}

function applyThemeToElement(element, theme) {
    const themeStyles = themes[theme];
    if (!themeStyles) {
        console.error(`Theme "${theme}" not found`);
        return;
    }

    if (element.tagName === 'BUTTON') {
        Object.entries(themeStyles.button).forEach(([property, value]) => {
            element.style[property] = value;
        });
    } else if (['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
        Object.entries(themeStyles.text).forEach(([property, value]) => {
            element.style[property] = value;
        });
    }
}

function applyTheme(theme) {
    const themeStyles = themes[theme];
    if (!themeStyles) {
        console.error(`Theme "${theme}" not found`);
        return;
    }

    Object.entries(themeStyles.body).forEach(([property, value]) => {
        document.body.style[property] = value;
    });

    document.querySelectorAll('button, p, span, h1, h2, h3, h4, h5, h6').forEach(element => {
        applyThemeToElement(element, theme);
    });

    localStorage.setItem('currentTheme', theme);
}

function observeUpgrades() {
    const upgradeArea = document.querySelector('#upgradeArea');
    if (!upgradeArea) {
        console.error("Upgrade area not found in the DOM");
        return;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const currentTheme = localStorage.getItem('currentTheme') || 'light';
                        applyThemeToElement(node, currentTheme);
                    }
                });
            }
        });
    });

    observer.observe(upgradeArea, { childList: true, subtree: true });
}

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', () => {
    const elements = { openSettings, resetButton, settingArea, openStats, showStat, themeSwitcher };
    Object.entries(elements).forEach(([name, element]) => {
        if (!element) console.error(`${name} not found in the DOM`);
    });

    if (openSettings) openSettings.addEventListener("click", toggleSettingArea);
    if (resetButton) resetButton.addEventListener("click", resetGame);
    if (openStats) openStats.addEventListener("click", toggleStats);
    if (themeSwitcher) themeSwitcher.addEventListener('change', (e) => applyTheme(e.target.value));

    // Apply saved theme or default
    const savedTheme = localStorage.getItem('currentTheme') || 'light';
    if (themeSwitcher) themeSwitcher.value = savedTheme;
    applyTheme(savedTheme);

    // Start observing for new upgrades
    observeUpgrades();
});

// Export functions that might be needed in other modules
export { applyTheme, applyThemeToElement };