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
    const newClicks = stats.clicks += stats.amountPerClick;
    const newTotalClicks = stats.totalClicks += stats.amountPerClick;
    clicks.innerText = newClicks;
    totalClicks.innerText = newTotalClicks;
}