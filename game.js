const telegrams = [
    {
        message: "Crisis económica golpea fuerte. ¿Invertir en educación o en industria?",
        choice1: { text: "Invertir en educación", effects: { resources: -10, publicOpinion: +15, militaryPower: 0 } },
        choice2: { text: "Invertir en industria", effects: { resources: -15, publicOpinion: +5, militaryPower: +10 } }
    },
    {
        message: "Tensión con Bolivia. ¿Enviar diplomáticos o preparar tropas?",
        choice1: { text: "Diplomáticos", effects: { resources: -5, publicOpinion: +10, militaryPower: 0 } },
        choice2: { text: "Preparar tropas", effects: { resources: -10, publicOpinion: -5, militaryPower: +15 } }
    },
    {
        message: "Propuesta de nueva ley laboral. ¿Aprobar o rechazar?",
        choice1: { text: "Aprobar", effects: { resources: -5, publicOpinion: +15, militaryPower: 0 } },
        choice2: { text: "Rechazar", effects: { resources: 0, publicOpinion: -10, militaryPower: 0 } }
    },
    {
        message: "Necesidad de financiar la Marina. ¿Subir impuestos o pedir préstamo?",
        choice1: { text: "Subir impuestos", effects: { resources: +10, publicOpinion: -15, militaryPower: +5 } },
        choice2: { text: "Pedir préstamo", effects: { resources: +15, publicOpinion: -5, militaryPower: 0 } }
    }
];

let currentTelegram = 0;
let resources = 50;
let publicOpinion = 50;
let militaryPower = 50;
let timer;
let timeLeft = 20;

const messageEl = document.getElementById("message");
const resourcesEl = document.getElementById("resources");
const publicOpinionEl = document.getElementById("publicOpinion");
const militaryPowerEl = document.getElementById("militaryPower");
const choice1Btn = document.getElementById("choice1");
const choice2Btn = document.getElementById("choice2");
const startBtn = document.getElementById("startBtn");
const timeLeftEl = document.getElementById("timeLeft");

function startGame() {
    currentTelegram = 0;
    resources = 50;
    publicOpinion = 50;
    militaryPower = 50;
    startBtn.disabled = true;
    choice1Btn.disabled = false;
    choice2Btn.disabled = false;
    nextTelegram();
}

function nextTelegram() {
    if (currentTelegram >= telegrams.length) {
        endGame();
        return;
    }
    const t = telegrams[currentTelegram];
    messageEl.textContent = t.message;
    choice1Btn.textContent = t.choice1.text;
    choice2Btn.textContent = t.choice2.text;
    timeLeft = 20;
    updateStats();
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timeLeftEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            currentTelegram++;
            nextTelegram();
        }
    }, 1000);
}

function choose(option) {
    const effects = telegrams[currentTelegram][option].effects;
    resources += effects.resources;
    publicOpinion += effects.publicOpinion;
    militaryPower += effects.militaryPower;
    currentTelegram++;
    nextTelegram();
}

function updateStats() {
    resourcesEl.textContent = resources;
    publicOpinionEl.textContent = publicOpinion;
    militaryPowerEl.textContent = militaryPower;
}

function endGame() {
    messageEl.textContent = "📜 Fin del mandato de Aníbal Pinto";
    choice1Btn.disabled = true;
    choice2Btn.disabled = true;
    startBtn.disabled = false;
    clearInterval(timer);
}

choice1Btn.addEventListener("click", () => choose("choice1"));
choice2Btn.addEventListener("click", () => choose("choice2"));
startBtn.addEventListener("click", startGame);
