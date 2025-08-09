(() => {
  // State bars initial values (0-100)
  let state = {
    resources: 50,
    publicOpinion: 50,
    militaryPower: 50,
    legislationSupport: 50,
  };

  const MAX_TIME = 20; // seconds per decision
  let timerId = null;
  let timeLeft = MAX_TIME;
  let currentDecision = 0;

  // 20 historical decisions for Aníbal Pinto's government:
  const decisions = [
    {
      text: "Crisis económica: ¿Aumentar impuestos o reducir gastos?",
      options: [
        {
          text: "Aumentar impuestos",
          effects: { resources: +10, publicOpinion: -15, militaryPower: 0, legislationSupport: -5 }
        },
        {
          text: "Reducir gastos",
          effects: { resources: -5, publicOpinion: +5, militaryPower: 0, legislationSupport: 0 }
        }
      ]
    },
    {
      text: "Tensión con Bolivia: ¿Enviar diplomáticos o movilizar tropas?",
      options: [
        {
          text: "Enviar diplomáticos",
          effects: { resources: -5, publicOpinion: +10, militaryPower: 0, legislationSupport: +5 }
        },
        {
          text: "Movilizar tropas",
          effects: { resources: -15, publicOpinion: -10, militaryPower: +20, legislationSupport: -10 }
        }
      ]
    },
    {
      text: "Reforma educativa: ¿Invertir en escuelas o universidades?",
      options: [
        {
          text: "Invertir en escuelas",
          effects: { resources: -10, publicOpinion: +15, militaryPower: 0, legislationSupport: +10 }
        },
        {
          text: "Invertir en universidades",
          effects: { resources: -15, publicOpinion: +5, militaryPower: 0, legislationSupport: +15 }
        }
      ]
    },
    {
      text: "Ley laboral: ¿Aprobar una nueva ley o mantener la actual?",
      options: [
        {
          text: "Aprobar ley",
          effects: { resources: -5, publicOpinion: +10, militaryPower: 0, legislationSupport: +15 }
        },
        {
          text: "Mantener actual",
          effects: { resources: 0, publicOpinion: -5, militaryPower: 0, legislationSupport: -10 }
        }
      ]
    },
    {
      text: "Flota naval: ¿Fortalecer flota o invertir en ejército terrestre?",
      options: [
        {
          text: "Fortalecer flota",
          effects: { resources: -15, publicOpinion: +5, militaryPower: +20, legislationSupport: 0 }
        },
        {
          text: "Invertir en ejército terrestre",
          effects: { resources: -10, publicOpinion: +5, militaryPower: +15, legislationSupport: 0 }
        }
      ]
    },
    {
      text: "Alianza con Perú: ¿Buscar alianza o mantener neutralidad?",
      options: [
        {
          text: "Buscar alianza",
          effects: { resources: -10, publicOpinion: 0, militaryPower: 0, legislationSupport: +10 }
        },
        {
          text: "Mantener neutralidad",
          effects: { resources: 0, publicOpinion: 0, militaryPower: 0, legislationSupport: 0 }
        }
      ]
    },
    {
      text: "Crisis diplomática: ¿Permitir negociación o endurecer postura?",
      options: [
        {
          text: "Permitir negociación",
          effects: { resources: -5, publicOpinion: +10, militaryPower: 0, legislationSupport: +5 }
        },
        {
          text: "Endurecer postura",
          effects: { resources: 0, publicOpinion: -10, militaryPower: +10, legislationSupport: -5 }
        }
      ]
    },
    {
      text: "Desarrollo industrial: ¿Subsidios o dejar libre mercado?",
      options: [
        {
          text: "Subsidios al sector",
          effects: { resources: -15, publicOpinion: +5, militaryPower: 0, legislationSupport: +5 }
        },
        {
          text: "Libre mercado",
          effects: { resources: 0, publicOpinion: 0, militaryPower: 0, legislationSupport: -5 }
        }
      ]
    },
    {
      text: "Control social: ¿Fortalecer policía o aumentar libertades?",
      options: [
        {
          text: "Fortalecer policía",
          effects: { resources: -10, publicOpinion: -10, militaryPower: +10, legislationSupport: 0 }
        },
        {
          text: "Aumentar libertades",
          effects: { resources: 0, publicOpinion: +10, militaryPower: -5, legislationSupport: +5 }
        }
      ]
    },
    {
      text: "Reforma agraria: ¿Redistribuir tierras o mantener status quo?",
      options: [
        {
          text: "Redistribuir tierras",
          effects: { resources: -15, publicOpinion: +10, militaryPower: 0, legislationSupport: +10 }
        },
        {
          text: "Mantener status quo",
          effects: { resources: 0, publicOpinion: -10, militaryPower: 0, legislationSupport: -10 }
        }
      ]
    },
    {
      text: "Modernización: ¿Invertir en ferrocarril o en puertos?",
      options: [
        {
          text: "Ferrocarril",
          effects: { resources: -15, publicOpinion: +10, militaryPower: 0, legislationSupport: +5 }
        },
        {
          text: "Puertos",
          effects: { resources: -10, publicOpinion: +5, militaryPower: 0, legislationSupport: +10 }
        }
      ]
    },
    {
      text: "Educación superior: ¿Crear universidades o centros técnicos?",
      options: [
        {
          text: "Universidades",
          effects: { resources: -15, publicOpinion: +10, militaryPower: 0, legislationSupport: +15 }
        },
        {
          text: "Centros técnicos",
          effects: { resources: -10, publicOpinion: +15, militaryPower: 0, legislationSupport: +10 }
        }
      ]
    },
    {
      text: "Presupuesto militar: ¿Aumentar o mantener?",
      options: [
        {
          text: "Aumentar",
          effects: { resources: -20, publicOpinion: 0, militaryPower: +20, legislationSupport: -5 }
        },
        {
          text: "Mantener",
          effects: { resources: 0, publicOpinion: +5, militaryPower: 0, legislationSupport: 0 }
        }
      ]
    },
    {
      text: "Relaciones exteriores: ¿Fortalecer alianzas o aislarse?",
      options: [
        {
          text: "Fortalecer alianzas",
          effects: { resources: -10, publicOpinion: +10, militaryPower: 0, legislationSupport: +10 }
        },
        {
          text: "Aislarse",
          effects: { resources: 0, publicOpinion: -10, militaryPower: 0, legislationSupport: -10 }
        }
      ]
    },
    {
      text: "Ley electoral: ¿Expandir voto o mantener restricción?",
      options: [
        {
          text: "Expandir voto",
          effects: { resources: -5, publicOpinion: +15, militaryPower: 0, legislationSupport: +5 }
        },
        {
          text: "Mantener restricción",
          effects: { resources: 0, publicOpinion: -10, militaryPower: 0, legislationSupport: -5 }
        }
      ]
    },
    {
      text: "Crisis financiera: ¿Solicitar préstamos o recortar gasto público?",
      options: [
        {
          text: "Solicitar préstamos",
          effects: { resources: +15, publicOpinion: -10, militaryPower: 0, legislationSupport: 0 }
        },
        {
          text: "Recortar gasto",
          effects: { resources: -5, publicOpinion: +5, militaryPower: 0, legislationSupport: 0 }
        }
      ]
    },
    {
      text: "Expansión territorial: ¿Comprar tierras o negociar tratados?",
      options: [
        {
          text: "Comprar tierras",
          effects: { resources: -10, publicOpinion: +10, militaryPower: 0, legislationSupport: +10 }
        },
        {
          text: "Negociar tratados",
          effects: { resources: -5, publicOpinion: +5, militaryPower: 0, legislationSupport: 0 }
        }
      ]
    },
    {
      text: "Apoyo a la minería: ¿Subsidios o impuestos?",
      options: [
        {
          text: "Subsidios",
          effects: { resources: -15, publicOpinion: +5, militaryPower: 0, legislationSupport: +5 }
        },
        {
          text: "Impuestos",
          effects: { resources: +10, publicOpinion: -10, militaryPower: 0, legislationSupport: -5 }
        }
      ]
    },
    {
      text: "Revolución tecnológica: ¿Adoptar nuevas tecnologías o conservar métodos tradicionales?",
      options: [
        {
          text: "Adoptar nuevas tecnologías",
          effects: { resources: -20, publicOpinion: +10, militaryPower: 0, legislationSupport: +10 }
        },
        {
          text: "Conservar métodos tradicionales",
          effects: { resources: 0, publicOpinion: -5, militaryPower: 0, legislationSupport: -5 }
        }
      ]
    },
    {
      text: "Última decisión: ¿Preparar el país para guerra o paz duradera?",
      options: [
        {
          text: "Preparar para guerra",
          effects: { resources: -25, publicOpinion: -10, militaryPower: +30, legislationSupport: -15 }
        },
        {
          text: "Buscar paz duradera",
          effects: { resources: -10, publicOpinion: +20, militaryPower: -5, legislationSupport: +20 }
        }
      ]
    },
  ];

  // Elements
  const telegramText = document.getElementById("telegram-text");
  const choice1Btn = document.getElementById("choice1");
  const choice2Btn = document.getElementById("choice2");
  const timerEl = document.getElementById("timer");
  const startBtn = document.getElementById("start-btn");
  const saveBtn = document.getElementById("save-btn");
  const loadBtn = document.getElementById("load-btn");
  const resetBtn = document.getElementById("reset-btn");

  const barResources = document.getElementById("bar-resources");
  const barPublic = document.getElementById("bar-public");
  const barMilitary = document.getElementById("bar-military");
  const barLegislation = document.getElementById("bar-legislation");

  // Utility functions
  function clamp(value, min=0, max=100) {
    return Math.min(max, Math.max(min, value));
  }

  function updateBars() {
    barResources.style.width = state.resources + "%";
    barPublic.style.width = state.publicOpinion + "%";
    barMilitary.style.width = state.militaryPower + "%";
    barLegislation.style.width = state.legislationSupport + "%";
  }

  // Timer logic
  function startTimer() {
    timeLeft = MAX_TIME;
    timerEl.textContent = timeLeft;
    clearInterval(timerId);
    timerId = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerId);
        skipDecision();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
  }

  // Game logic
  function loadDecision(index) {
    if (index >= decisions.length) {
      endGame();
      return;
    }
    currentDecision = index;
    const decision = decisions[index];
    telegramText.textContent = decision.text;
    choice1Btn.textContent = decision.options[0].text;
    choice2Btn.textContent = decision.options[1].text;
    choice1Btn.disabled = false;
    choice2Btn.disabled = false;
    startTimer();
    updateBars();
  }

  function applyEffects(effects) {
    state.resources = clamp(state.resources + effects.resources);
    state.publicOpinion = clamp(state.publicOpinion + effects.publicOpinion);
    state.militaryPower = clamp(state.militaryPower + effects.militaryPower);
    state.legislationSupport = clamp(state.legislationSupport + effects.legislationSupport);
    updateBars();
  }

  function chooseOption(optionIndex) {
    stopTimer();
    const decision = decisions[currentDecision];
    applyEffects(decision.options[optionIndex].effects);
    currentDecision++;
    if (currentDecision >= decisions.length) {
      endGame();
    } else {
      loadDecision(currentDecision);
    }
  }

  function skipDecision() {
    // If timer runs out, just move to next without effects
    currentDecision++;
    if (currentDecision >= decisions.length) {
      endGame();
    } else {
      loadDecision(currentDecision);
    }
  }

  // Save/load game progress
  function saveGame() {
    const saveData = {
      state,
      currentDecision
    };
    localStorage.setItem("anibalPintoSave", JSON.stringify(saveData));
    alert("Progreso guardado.");
  }

  function loadGame() {
    const saveDataRaw = localStorage.getItem("anibalPintoSave");
    if (!saveDataRaw) {
      alert("No hay progreso guardado.");
      return;
    }
    const saveData = JSON.parse(saveDataRaw);
    state = saveData.state;
    currentDecision = saveData.currentDecision;
    loadDecision(currentDecision);
    startBtn.disabled = true;
    saveBtn.disabled = false;
  }

  function resetGame() {
    stopTimer();
    state = {resources:50, publicOpinion:50, militaryPower:50, legislationSupport:50};
    currentDecision = 0;
    telegramText.textContent = "Presiona \"Iniciar\" para comenzar.";
    choice1Btn.disabled = true;
    choice2Btn.disabled = true;
    choice1Btn.textContent = "";
    choice2Btn.textContent = "";
    timerEl.textContent = MAX_TIME;
    startBtn.disabled = false;
    saveBtn.disabled = true;
  }

  function endGame() {
    stopTimer();
    telegramText.textContent = "🏁 Fin del mandato de Aníbal Pinto. Gracias por jugar.";
    choice1Btn.disabled = true;
    choice2Btn.disabled = true;
    startBtn.disabled = false;
    saveBtn.disabled = true;
  }

  // Event Listeners
  choice1Btn.addEventListener("click", () => chooseOption(0));
  choice2Btn.addEventListener("click", () => chooseOption(1));
  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    saveBtn.disabled = false;
    loadDecision(0);
  });
  saveBtn.addEventListener("click", saveGame);
  loadBtn.addEventListener("click", loadGame);
  resetBtn.addEventListener("click", resetGame);

  // Initialize UI on load
  resetGame();
})();
