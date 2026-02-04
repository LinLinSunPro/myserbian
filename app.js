function switchTab(tabId) {
    // UI logic for switching tabs
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    // Trigger Vibe Change
    triggerVibeChange();
}

// BALKAN ZEN MONITOR LOGIC
const vibePhrases = [
    "STAV: <b>POLAKO</b>",
    "PROMAJA: <b>NEMA</b>",
    "KAFA: <b>ČEKA SE</b>",
    "RAKIJA: <b>SAMO MALO</b>"
];

let currentVibeIndex = 0;

function triggerVibeChange() {
    const vibeText = document.getElementById('vibe-text');
    if (!vibeText) return;

    // Smooth fade out
    vibeText.style.opacity = '0';

    setTimeout(() => {
        // Change text
        currentVibeIndex = (currentVibeIndex + 1) % vibePhrases.length;
        vibeText.innerHTML = vibePhrases[currentVibeIndex];

        // Smooth fade in
        vibeText.style.opacity = '1';
    }, 1500); // 1.5s delay for that luxury Zen feel
}

// Initial state
document.addEventListener('DOMContentLoaded', () => {
    const vibeText = document.getElementById('vibe-text');
    if (vibeText) vibeText.style.opacity = '1';
});
