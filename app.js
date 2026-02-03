const grammarData = {
    pronouns: [
        { person: "JA", sm: "moj", sf: "moja", sn: "moje", pm: "moji", pf: "moje", pn: "moja" },
        { person: "TI", sm: "tvoj", sf: "tvoja", sn: "tvoje", pm: "tvoji", pf: "tvoje", pn: "tvoja" },
        { person: "ON", sm: "njegov", sf: "njegova", sn: "njegovo", pm: "njegovi", pf: "njegove", pn: "njegova" },
        { person: "ONA", sm: "njen", sf: "njena", sn: "njeno", pm: "njeni", pf: "njene", pn: "njena" },
        { person: "ONO", sm: "njegov", sf: "njegova", sn: "njegovo", pm: "njegovi", pf: "njegove", pn: "njegova" },
        { person: "MI", sm: "naš", sf: "naša", sn: "naše", pm: "naši", pf: "naše", pn: "naša" },
        { person: "VI", sm: "vaš", sf: "vaša", sn: "vaše", pm: "vaši", pf: "vaše", pn: "vaša" },
        { person: "ONI/ONE/ONA", sm: "njihov", sf: "njihova", sn: "njihovo", pm: "njihovi", pf: "njihove", pn: "njihova" }
    ],
    biti: {
        positive: [
            { p: "1st Sg", text: "sam (jesam)", plural: "smo (jesmo)" },
            { p: "2nd Sg", text: "si", plural: "ste (jeste)" },
            { p: "3rd Sg", text: "je (jeste)", plural: "su" }
        ],
        negative: [
            { p: "1st Sg", text: "nisam", plural: "nismo" },
            { p: "2nd Sg", text: "nisi", plural: "niste" },
            { p: "3rd Sg", text: "nije", plural: "nisu" }
        ]
    },
    verbs: [
        { name: "Raditi", root: "radi", ending: "m", translation: "to work" },
        { name: "Učiti", root: "uči", ending: "m", translation: "to study" },
        { name: "Govoriti", root: "govori", ending: "m", translation: "to speak" },
        { name: "Živeti", root: "živi", ending: "m", translation: "to live" },
        { name: "Voleti", root: "voli", ending: "m", translation: "to love" }
    ]
};

function switchTab(tabId) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    const tabBtn = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
    if (tabBtn) tabBtn.classList.add('active');
}

// Homework Logic
function checkInputs(btn) {
    const group = btn.parentElement;
    const inputs = group.querySelectorAll('.hw-input');

    inputs.forEach(input => {
        const correctVal = input.getAttribute('data-answer');
        if (!correctVal) return;

        const userVal = input.value.trim().toLowerCase();
        if (userVal === correctVal.toLowerCase()) {
            input.classList.remove('incorrect');
            input.classList.add('correct');
        } else {
            input.classList.remove('correct');
            input.classList.add('incorrect');
        }
    });
}

function selectChip(chip) {
    const container = chip.parentElement;
    container.querySelectorAll('.select-chip').forEach(c => c.classList.remove('selected', 'correct', 'incorrect'));
    chip.classList.add('selected');
}

function checkSelections(btn) {
    const group = btn.parentElement;
    const containers = group.querySelectorAll('.select-container');

    containers.forEach(container => {
        const correctVal = container.getAttribute('data-answer');
        const selected = container.querySelector('.select-chip.selected');

        if (selected) {
            if (selected.innerText === correctVal) {
                selected.classList.add('correct');
            } else {
                selected.classList.add('incorrect');
            }
        }
    });
}

// Simple Quiz Logic
function checkAnswer(btn, isCorrect) {
    if (isCorrect) {
        btn.style.background = "#00c853";
    } else {
        btn.style.background = "#ff5252";
    }
    setTimeout(() => {
        btn.style.background = "";
        generateNewQuestion();
    }, 1000);
}

function generateNewQuestion() {
    const questions = [
        { q: "How do you say 'Our' (masculine singular)?", a: "naš", options: ["naš", "vaš", "moj", "tvoj"] },
        { q: "What is the negative form of 'We are'?", a: "nismo", options: ["nismo", "niste", "nisu", "nisam"] },
        { q: "Translate: 'I live'", a: "živim", options: ["živim", "živiš", "živi", "živimo"] }
    ];

    const randomIdx = Math.floor(Math.random() * questions.length);
    const q = questions[randomIdx];

    const qEl = document.querySelector('.quiz-question');
    const optsEl = document.querySelector('.quiz-options');

    if (qEl && optsEl) {
        qEl.innerText = q.q;
        const optionsHtml = q.options.sort(() => Math.random() - 0.5).map(opt =>
            `<button class="option-btn" onclick="checkAnswer(this, '${opt}' === '${q.a}')">${opt}</button>`
        ).join('');
        optsEl.innerHTML = optionsHtml;
    }
}

// Initial load
window.onload = () => {
    generateNewQuestion();
};
