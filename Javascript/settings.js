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
        body: { backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif' },
        button: { 
            backgroundColor: '#f0f0f0', 
            color: '#000000', 
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            margin: '5px',
            cursor: 'pointer',
            display: 'block',
            width: '100%'
        },
        text: { color: '#000000' },
        div: { 
            backgroundColor: '#f9f9f9', 
            color: '#000000', 
            padding: '10px', 
            borderRadius: '5px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)', 
            margin: '5px',
            textAlign: 'center'
        },
        select: {
            backgroundColor: '#ffffff',
            color: '#000000',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '5px',
            margin: '5px',
            width: '100%'
        }
    },
    dark: {
        body: { backgroundColor: '#1a1a1a', color: '#ffffff', fontFamily: 'Arial, sans-serif' },
        button: { 
            backgroundColor: '#333333', 
            color: '#ffffff', 
            border: '1px solid #444',
            borderRadius: '5px',
            padding: '10px',
            margin: '5px',
            cursor: 'pointer',
            display: 'block',
            width: '100%'
        },
        text: { color: '#ffffff' },
        div: { 
            backgroundColor: '#2c2c2c', 
            color: '#ffffff', 
            padding: '10px', 
            borderRadius: '5px', 
            boxShadow: '0 1px 3px rgba(255,255,255,0.1)', 
            margin: '5px',
            textAlign: 'center'
        },
        select: {
            backgroundColor: '#333333',
            color: '#ffffff',
            border: '1px solid #444',
            borderRadius: '5px',
            padding: '5px',
            margin: '5px',
            width: '100%'
        }
    },
    noob: {
        body: { backgroundColor: 'rgb(165,188,80)', color: 'rgb(86, 72, 72)', fontFamily: 'Comic Sans MS, cursive' },
        button: { 
            borderRadius: '3px',   
            border: 'none',      
            backgroundColor: '#176baa',       
            color: 'white',       
            width: '100%',       
            fontWeight: '500',       
            transition: 'transform 0.5s',     
            padding: '2px',
            margin: '2px',
            display: 'block',
            position: 'relative',
            cursor: 'pointer'
        },
        text: { color: 'rgb(86, 72, 72)' },
        div: { 
            backgroundColor: 'rgb(244,204,67)', 
            color: 'white', 
            height: 'auto', 
            padding: '10px 20px', 
            borderRadius: '10px',
            boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', 
            margin: '5px', 
            textAlign: 'center',
            fontSize: '30px',
            fontWeight: 'bold'
        },
        select: {
            backgroundColor: '#176baa',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            padding: '5px',
            margin: '5px',
            width: '100%',
            fontSize: '14px'
        }
    },
    discord: {
        body: { backgroundColor: '#36393f', color: '#dcddde', fontFamily: 'Whitney, Helvetica Neue, Helvetica, Arial, sans-serif' },
        button: { 
            backgroundColor: '#4e5d94', 
            color: '#ffffff',
            border: 'none',
            borderRadius: '3px',
            padding: '10px 20px',
            margin: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'block',
            width: '100%'
        },
        text: { color: '#dcddde' },
        div: { 
            backgroundColor: '#2f3136', 
            color: '#dcddde', 
            padding: '10px', 
            borderRadius: '5px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.16)', 
            margin: '5px',
            textAlign: 'left'
        },
        select: {
            backgroundColor: '#2f3136',
            color: '#dcddde',
            border: '1px solid #202225',
            borderRadius: '3px',
            padding: '5px',
            margin: '5px',
            width: '100%',
            fontSize: '14px'
        }
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
    } else if (element.tagName === 'DIV') {
        Object.entries(themeStyles.div).forEach(([property, value]) => {
            element.style[property] = value;
        });
    } else if (element.tagName === 'SELECT') {
        Object.entries(themeStyles.select).forEach(([property, value]) => {
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

    document.querySelectorAll('button, p, span, h1, h2, h3, h4, h5, h6, div, select').forEach(element => {
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