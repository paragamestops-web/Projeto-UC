// ==========================================
// TIGER SPIN
// Minijogo com dinheiro virtual + SONS
// ==========================================


// ==========================================
// CONFIGURAÇÕES
// ==========================================

const TIGER_SYMBOLS = [
    {
        symbol: "🐯",
        multiplier: 10
    },
    {
        symbol: "💎",
        multiplier: 7
    },
    {
        symbol: "⭐",
        multiplier: 5
    },
    {
        symbol: "🍀",
        multiplier: 3
    },
    {
        symbol: "🍒",
        multiplier: 2
    }
];

const BET_VALUES = [
    10,
    25,
    50,
    100,
    250,
    500
];


// ==========================================
// CHANCES
// ==========================================

// Chance da CARTA BÔNUS
const BONUS_CARD_CHANCE = 0.05;

// Chance do BÔNUS DE 10 GIROS
const TEN_SPIN_BONUS_CHANCE = 0.10;


// ==========================================
// ESTADO
// ==========================================

let betIndex = 0;
let spinning = false;
let spinHistory = [];

let bonusSpinActive = false;
let bonusSpinsRemaining = 0;


// ==========================================
// ÁUDIO — WEB AUDIO API
// ==========================================

let audioContext = null;

function initAudio() {

    if (!audioContext) {

        audioContext =
            new (window.AudioContext ||
                window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}


// ==========================================
// TOCAR TOM
// ==========================================

function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.08,
    delay = 0
) {

    initAudio();

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    const startTime =
        audioContext.currentTime + delay;

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        startTime
    );

    gain.gain.setValueAtTime(
        0,
        startTime
    );

    gain.gain.linearRampToValueAtTime(
        volume,
        startTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        startTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(startTime);

    oscillator.stop(
        startTime + duration + 0.05
    );
}


// ==========================================
// SOM — CLIQUE
// ==========================================

function playClickSound() {

    playTone(
        500,
        0.06,
        "square",
        0.04
    );
}


// ==========================================
// SOM — GIRO NORMAL
// ==========================================

function playSpinSound() {

    initAudio();

    playTone(
        180,
        0.08,
        "square",
        0.035
    );

    playTone(
        220,
        0.08,
        "square",
        0.035,
        0.10
    );

    playTone(
        260,
        0.08,
        "square",
        0.035,
        0.20
    );

    playTone(
        300,
        0.08,
        "square",
        0.035,
        0.30
    );

    playTone(
        340,
        0.08,
        "square",
        0.035,
        0.40
    );
}


// ==========================================
// SOM — VITÓRIA
// ==========================================

function playWinSound() {

    initAudio();

    playTone(
        523.25,
        0.15,
        "sine",
        0.08
    );

    playTone(
        659.25,
        0.15,
        "sine",
        0.08,
        0.12
    );

    playTone(
        783.99,
        0.20,
        "sine",
        0.09,
        0.24
    );

    playTone(
        1046.50,
        0.35,
        "sine",
        0.12,
        0.38
    );
}


// ==========================================
// SOM — DERROTA
// ==========================================

function playLoseSound() {

    initAudio();

    playTone(
        220,
        0.20,
        "sawtooth",
        0.055
    );

    playTone(
        180,
        0.25,
        "sawtooth",
        0.05,
        0.18
    );

    playTone(
        140,
        0.35,
        "sawtooth",
        0.04,
        0.38
    );
}


// ==========================================
// SOM — CARTA BÔNUS
// ==========================================

function playBonusCardSound() {

    initAudio();

    playTone(
        300,
        0.12,
        "triangle",
        0.07
    );

    playTone(
        450,
        0.12,
        "triangle",
        0.07,
        0.12
    );

    playTone(
        600,
        0.15,
        "triangle",
        0.08,
        0.24
    );

    playTone(
        900,
        0.30,
        "sine",
        0.10,
        0.38
    );
}


// ==========================================
// SOM — INÍCIO DO BÔNUS
// ==========================================

function playBonusStartSound() {

    initAudio();

    playTone(
        392,
        0.12,
        "square",
        0.06
    );

    playTone(
        523.25,
        0.12,
        "square",
        0.07,
        0.12
    );

    playTone(
        659.25,
        0.12,
        "square",
        0.08,
        0.24
    );

    playTone(
        783.99,
        0.40,
        "sine",
        0.12,
        0.36
    );
}


// ==========================================
// SOM — GIRO DO BÔNUS
// ==========================================

function playBonusSpinSound() {

    initAudio();

    playTone(
        440,
        0.10,
        "triangle",
        0.05
    );

    playTone(
        554.37,
        0.10,
        "triangle",
        0.05,
        0.10
    );

    playTone(
        659.25,
        0.15,
        "triangle",
        0.06,
        0.20
    );
}


// ==========================================
// SOM — FINAL DO BÔNUS
// ==========================================

function playBonusEndSound() {

    initAudio();

    playTone(
        523.25,
        0.15,
        "sine",
        0.08
    );

    playTone(
        659.25,
        0.15,
        "sine",
        0.08,
        0.15
    );

    playTone(
        783.99,
        0.15,
        "sine",
        0.09,
        0.30
    );

    playTone(
        1046.50,
        0.20,
        "sine",
        0.10,
        0.45
    );

    playTone(
        1318.51,
        0.45,
        "sine",
        0.12,
        0.65
    );
}


// ==========================================
// SOM — BIG WIN
// ==========================================

function playBigWinSound() {

    initAudio();

    playTone(
        523.25,
        0.12,
        "square",
        0.07
    );

    playTone(
        659.25,
        0.12,
        "square",
        0.08,
        0.12
    );

    playTone(
        783.99,
        0.12,
        "square",
        0.09,
        0.24
    );

    playTone(
        1046.50,
        0.18,
        "sine",
        0.10,
        0.36
    );

    playTone(
        1318.51,
        0.30,
        "sine",
        0.12,
        0.54
    );

    playTone(
        1567.98,
        0.50,
        "sine",
        0.13,
        0.72
    );
}


// ==========================================
// ELEMENTOS
// ==========================================

const reel1 =
    document.getElementById("reel1");

const reel2 =
    document.getElementById("reel2");

const reel3 =
    document.getElementById("reel3");

const reel4 =
    document.getElementById("reel4");

const reel5 =
    document.getElementById("reel5");

const reel6 =
    document.getElementById("reel6");

const reel7 =
    document.getElementById("reel7");

const reel8 =
    document.getElementById("reel8");

const reel9 =
    document.getElementById("reel9");

const betAmount =
    document.getElementById("betAmount");

const spinButton =
    document.getElementById("spinButton");

const gameBalance =
    document.getElementById("gameBalance");

const spinResult =
    document.getElementById("spinResult");

const spinHistoryElement =
    document.getElementById("spinHistory");


const reels = [
    reel1,
    reel2,
    reel3,
    reel4,
    reel5,
    reel6,
    reel7,
    reel8,
    reel9
];


// ==========================================
// SALDO
// ==========================================

function updateTigerBalance() {

    const player =
        loadPlayer();

    const formatted =
        player.balance.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    const headerBalance =
        document.getElementById("balance");

    if (headerBalance) {
        headerBalance.textContent =
            formatted;
    }

    if (gameBalance) {
        gameBalance.textContent =
            formatted;
    }
}


// ==========================================
// APOSTA
// ==========================================

function updateBetDisplay() {

    if (!betAmount) {
        return;
    }

    betAmount.textContent =
        BET_VALUES[betIndex]
            .toLocaleString("pt-BR");
}


function changeBet(direction) {

    if (
        spinning ||
        bonusSpinActive
    ) {
        return;
    }

    playClickSound();

    betIndex += direction;

    if (betIndex < 0) {
        betIndex = 0;
    }

    if (
        betIndex >= BET_VALUES.length
    ) {
        betIndex =
            BET_VALUES.length - 1;
    }

    updateBetDisplay();
}


// ==========================================
// SÍMBOLO ALEATÓRIO
// ==========================================

function randomSymbol() {

    const index =
        Math.floor(
            Math.random() *
            TIGER_SYMBOLS.length
        );

    return TIGER_SYMBOLS[index];
}


// ==========================================
// CHANCE DO BÔNUS DE 10 GIROS
// ==========================================

function checkTenSpinBonus() {

    return (
        Math.random() <
        TEN_SPIN_BONUS_CHANCE
    );
}


// ==========================================
// ATIVAR BÔNUS DE 10 GIROS
// ==========================================

function activateTenSpinBonus() {

    playBonusStartSound();

    bonusSpinActive = true;

    bonusSpinsRemaining = 10;

    createTenSpinBonusElements();

    const overlay =
        document.getElementById(
            "tenSpinBonusOverlay"
        );

    if (overlay) {

        overlay.classList.remove(
            "active"
        );

        void overlay.offsetWidth;

        overlay.classList.add(
            "active"
        );
    }

    if (spinButton) {
        spinButton.disabled = true;
    }

    if (spinResult) {

        spinResult.className =
            "spin-result win";

        spinResult.textContent =
            "🔥 BÔNUS DESBLOQUEADO! 10 GIROS GRÁTIS!";
    }

    updateBonusDisplay();

    setTimeout(() => {

        if (overlay) {
            overlay.classList.remove(
                "active"
            );
        }

        setTimeout(() => {

            startAutomaticBonusSpins();

        }, 500);

    }, 2500);
}


// ==========================================
// INICIAR OS 10 GIROS AUTOMATICAMENTE
// ==========================================

function startAutomaticBonusSpins() {

    if (!bonusSpinActive) {
        return;
    }

    if (
        bonusSpinsRemaining <= 0
    ) {

        finishTenSpinBonus();

        return;
    }

    if (spinning) {

        setTimeout(() => {

            startAutomaticBonusSpins();

        }, 300);

        return;
    }

    spinTiger(true);
}


// ==========================================
// ATUALIZAR TEXTO DO BÔNUS
// ==========================================

function updateBonusDisplay() {

    if (!spinResult) {
        return;
    }

    if (!bonusSpinActive) {
        return;
    }

    const current =
        11 - bonusSpinsRemaining;

    spinResult.className =
        "spin-result win";

    spinResult.textContent =
        `🔥 BÔNUS 10× — GIRO ${current}/10`;
}


// ==========================================
// CRIAR ELEMENTOS DO BÔNUS
// ==========================================

function createTenSpinBonusElements() {

    if (
        document.getElementById(
            "tenSpinBonusOverlay"
        )
    ) {
        return;
    }


    // --------------------------------------
    // CSS DO BÔNUS
    // --------------------------------------

    const style =
        document.createElement("style");

    style.id =
        "tenSpinBonusStyle";

    style.textContent = `

        .ten-spin-bonus-overlay {

            position: fixed;
            inset: 0;

            z-index: 99999;

            display: flex;
            align-items: center;
            justify-content: center;

            pointer-events: none;

            opacity: 0;

            background:
                radial-gradient(
                    circle,
                    rgba(255,175,0,.20),
                    rgba(0,0,0,.82)
                );

            transition:
                opacity .35s ease;
        }


        .ten-spin-bonus-overlay.active {

            opacity: 1;
        }


        .ten-spin-bonus-box {

            width: min(420px, 88%);

            padding: 30px 24px;

            border-radius: 24px;

            text-align: center;

            background:
                linear-gradient(
                    145deg,
                    #241400,
                    #100b04
                );

            border:
                2px solid #ffc400;

            box-shadow:
                0 0 30px rgba(255,190,0,.35),
                0 0 100px rgba(255,130,0,.15);

            transform:
                scale(.65)
                rotate(-4deg);

            transition:
                transform .55s
                cubic-bezier(.17,.89,.32,1.35);
        }


        .ten-spin-bonus-overlay.active
        .ten-spin-bonus-box {

            transform:
                scale(1)
                rotate(0deg);
        }


        .ten-spin-bonus-icon {

            font-size: 64px;

            margin-bottom: 8px;

            animation:
                tigerBonusPulse
                1s infinite alternate;
        }


        .ten-spin-bonus-title {

            font-size: 28px;

            font-weight: 900;

            color: #ffd21a;

            text-shadow:
                0 0 18px
                rgba(255,190,0,.55);
        }


        .ten-spin-bonus-x {

            margin: 12px 0;

            font-size: 44px;

            font-weight: 1000;

            color: #fff;

            text-shadow:
                0 0 20px #ffb700;
        }


        .ten-spin-bonus-text {

            font-size: 15px;

            line-height: 1.5;

            color:
                rgba(255,255,255,.88);
        }


        .ten-spin-bonus-chance {

            margin-top: 15px;

            font-size: 12px;

            color: #ffc928;

            opacity: .85;
        }


        @keyframes tigerBonusPulse {

            from {
                transform: scale(1);
            }

            to {
                transform: scale(1.15);
            }
        }

    `;

    document.head.appendChild(style);


    // --------------------------------------
    // INFORMAÇÃO
    // --------------------------------------

    const info =
        document.createElement("div");

    info.id =
        "tenSpinBonusInfo";

    info.className =
        "ten-spin-bonus-info";

    info.innerHTML = `

        <strong>
            🔥 BÔNUS 10×
        </strong>

        <span>
            Chance de 1 em 10 por giro:
            ganhe 10 giros bônus e todos os
            prêmios desses giros valem 10×.
        </span>

    `;


    if (
        spinResult &&
        spinResult.parentElement
    ) {

        spinResult.parentElement.insertBefore(
            info,
            spinResult
        );

    } else {

        document.body.appendChild(info);
    }


    // --------------------------------------
    // OVERLAY
    // --------------------------------------

    const overlay =
        document.createElement("div");

    overlay.id =
        "tenSpinBonusOverlay";

    overlay.className =
        "ten-spin-bonus-overlay";


    overlay.innerHTML = `

        <div class="ten-spin-bonus-box">

            <div class="ten-spin-bonus-icon">
                🐯
            </div>

            <div class="ten-spin-bonus-title">
                BÔNUS DESBLOQUEADO!
            </div>

            <div class="ten-spin-bonus-x">
                10 GIROS ×10
            </div>

            <div class="ten-spin-bonus-text">

                Você ganhou 10 giros bônus!

                <br>

                Os prêmios desses giros
                recebem multiplicador
                de <strong>10×</strong>.

            </div>

            <div class="ten-spin-bonus-chance">

                🎯 Chance do evento:
                10% por giro

            </div>

        </div>

    `;

    document.body.appendChild(overlay);
}


// ==========================================
// GIRAR
// ==========================================

function spinTiger(
    isAutomaticBonus = false
) {

    if (spinning) {
        return;
    }

    initAudio();

    const amount =
        BET_VALUES[betIndex];

    const player =
        loadPlayer();


    // ======================================
    // GIRO NORMAL
    // ======================================

    if (!bonusSpinActive) {

        if (
            player.balance < amount
        ) {

            showTigerMessage(
                "Você não possui saldo suficiente."
            );

            playLoseSound();

            return;
        }

        // Retira aposta
        addBalance(-amount);

        updateTigerBalance();
    }


    // ======================================
    // INICIA GIRO
    // ======================================

    spinning = true;

    if (spinButton) {
        spinButton.disabled = true;
    }


    // Som do giro
    if (bonusSpinActive) {
        playBonusSpinSound();
    } else {
        playSpinSound();
    }


    if (
        spinResult &&
        !bonusSpinActive
    ) {

        spinResult.className =
            "spin-result";

        spinResult.textContent =
            "Girando...";
    }


    if (bonusSpinActive) {
        updateBonusDisplay();
    }


    reels.forEach(reel => {

        if (!reel) {
            return;
        }

        reel.classList.remove(
            "winning"
        );

        reel.classList.add(
            "spinning"
        );
    });


    let elapsed = 0;


    const interval =
        setInterval(() => {

            reels.forEach(reel => {

                if (!reel) {
                    return;
                }

                reel.textContent =
                    randomSymbol().symbol;
            });


            elapsed += 100;


            if (elapsed >= 1400) {

                clearInterval(interval);

                finishSpin(amount);
            }

        }, 100);
}


// ==========================================
// FINALIZAR GIRO
// ==========================================

function finishSpin(amount) {

    const results =
        reels.map(() =>
            randomSymbol()
        );


    // --------------------------------------
    // MOSTRAR RESULTADO
    // --------------------------------------

    reels.forEach(
        (reel, index) => {

            if (!reel) {
                return;
            }

            reel.textContent =
                results[index].symbol;

            reel.classList.remove(
                "spinning"
            );
        }
    );


    // ======================================
    // COMBINAÇÕES
    // ======================================

    const winningLines =
        getWinningLines(results);

    let reward = 0;


    if (
        winningLines.length > 0
    ) {

        winningLines.forEach(line => {

            const first =
                results[line[0]];

            reward +=
                amount *
                first.multiplier;
        });


        winningLines.forEach(line => {

            line.forEach(index => {

                if (reels[index]) {

                    reels[index]
                        .classList
                        .add("winning");
                }

            });

        });
    }


    // ======================================
    // VERIFICA SE É BÔNUS
    // ======================================

    const isBonusSpin =
        bonusSpinActive;


    // ======================================
    // MULTIPLICADOR DO BÔNUS
    // ======================================

    if (isBonusSpin) {

        reward *= 10;

        bonusSpinsRemaining--;

        updateBonusDisplay();
    }


    // ======================================
    // CARTA BÔNUS — 5%
    // ======================================

    let bonusCard = false;

    if (!isBonusSpin) {

        bonusCard =
            Math.random() <
            BONUS_CARD_CHANCE;
    }


    if (bonusCard) {

        const normalReward =
            reward;


        // Se não ganhou nada,
        // a carta garante prêmio base.

        if (reward <= 0) {

            reward =
                amount * 10;

        } else {

            reward *= 10;
        }


        showBonusCard(
            normalReward,
            reward
        );
    }


    // ======================================
    // SONS
    // ======================================

    if (bonusCard) {

        playBonusCardSound();

    } else if (reward > 0) {

        if (
            reward >= amount * 20
        ) {

            playBigWinSound();

        } else {

            playWinSound();
        }

    } else {

        playLoseSound();
    }


    // ======================================
    // PAGAR PRÊMIO
    // ======================================

    if (reward > 0) {

        addBalance(reward);


        if (!bonusCard) {

            if (spinResult) {

                spinResult.className =
                    "spin-result win";


                if (isBonusSpin) {

                    spinResult.textContent =
                        `🔥 BÔNUS 10×! +${formatBRL(reward)}`;

                } else {

                    spinResult.textContent =
                        `🎉 GANHOU! +${formatBRL(reward)}`;
                }
            }
        }

    } else {

        if (spinResult) {

            spinResult.className =
                "spin-result loss";


            if (isBonusSpin) {

                spinResult.textContent =
                    "🔥 BÔNUS 10× — sem combinação.";

            } else {

                spinResult.textContent =
                    `Não foi dessa vez. -${formatBRL(amount)}`;
            }
        }
    }


    // ======================================
    // HISTÓRICO
    // ======================================

    addSpinHistory(
        results,
        amount,
        reward,
        isBonusSpin
    );


    updateTigerBalance();


    // ======================================
    // TERMINOU O BÔNUS?
    // ======================================

    if (
        bonusSpinActive &&
        bonusSpinsRemaining <= 0
    ) {

        finishTenSpinBonus();

    } else if (bonusSpinActive) {

        // Próximo giro automático
        setTimeout(() => {

            if (bonusSpinActive) {
                startAutomaticBonusSpins();
            }

        }, 900);
    }


    // ======================================
    // CHANCE DO NOVO BÔNUS
    // ======================================

    if (!isBonusSpin) {

        if (checkTenSpinBonus()) {

            setTimeout(() => {

                activateTenSpinBonus();

            }, 700);
        }
    }


    // ======================================
    // FINALIZA GIRO
    // ======================================

    spinning = false;


    // Durante o bônus botão continua bloqueado
    if (spinButton) {

        if (bonusSpinActive) {

            spinButton.disabled = true;

        } else {

            spinButton.disabled = false;
        }
    }
}


// ==========================================
// FINALIZAR BÔNUS DE 10 GIROS
// ==========================================

function finishTenSpinBonus() {

    playBonusEndSound();

    bonusSpinActive = false;

    bonusSpinsRemaining = 0;

    spinning = false;


    if (spinButton) {
        spinButton.disabled = false;
    }


    if (spinResult) {

        spinResult.className =
            "spin-result win";

        spinResult.textContent =
            "🏆 BÔNUS FINALIZADO! Os 10 giros terminaram.";
    }
}


// ==========================================
// COMBINAÇÕES
// ==========================================

function getWinningLines(results) {

    const lines = [

        // Linhas
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        // Colunas
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        // Diagonais
        [0, 4, 8],
        [2, 4, 6]

    ];


    return lines.filter(line => {

        const first =
            results[line[0]].symbol;


        return (
            results[line[1]].symbol === first &&
            results[line[2]].symbol === first
        );
    });
}


// ==========================================
// FORMATAR R$
// ==========================================

function formatBRL(value) {

    return Number(value)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
}


// ==========================================
// CARTA BÔNUS
// ==========================================

function showBonusCard(
    normalReward,
    finalReward
) {

    createBonusCardElement();


    const overlay =
        document.getElementById(
            "tigerBonusOverlay"
        );


    const card =
        document.getElementById(
            "tigerBonusCard"
        );


    const rewardElement =
        document.getElementById(
            "bonusReward"
        );


    if (
        !overlay ||
        !card
    ) {
        return;
    }


    // --------------------------------------
    // RESET COMPLETO
    // --------------------------------------

    overlay.classList.remove(
        "show",
        "almost"
    );

    card.classList.remove(
        "flip"
    );


    void overlay.offsetWidth;
    void card.offsetWidth;


    // --------------------------------------
    // MOSTRA CARTA
    // --------------------------------------

    overlay.classList.add(
        "show"
    );


    // --------------------------------------
    // ANIMAÇÃO DE ENTRADA
    // --------------------------------------

    setTimeout(() => {

        if (!card) {
            return;
        }

        card.classList.add(
            "almost"
        );

    }, 250);


    // --------------------------------------
    // REVELA CARTA
    // --------------------------------------

    setTimeout(() => {

        if (!card) {
            return;
        }

        card.classList.remove(
            "almost"
        );

        card.classList.add(
            "flip"
        );

    }, 1100);


    // --------------------------------------
    // MOSTRA PRÊMIO
    // --------------------------------------

    setTimeout(() => {

        if (rewardElement) {

            rewardElement.textContent =
                `+${formatBRL(finalReward)}`;
        }

    }, 1500);


    // --------------------------------------
    // FECHA CARTA
    // --------------------------------------

    setTimeout(() => {

        overlay.classList.remove(
            "show"
        );

        card.classList.remove(
            "flip"
        );

    }, 3600);


    if (spinResult) {

        spinResult.className =
            "spin-result win";

        spinResult.textContent =
            `🎴 CARTA BÔNUS! +${formatBRL(finalReward)}`;
    }
}


// ==========================================
// CRIAR CARTA
// ==========================================

function createBonusCardElement() {

    if (
        document.getElementById(
            "tigerBonusOverlay"
        )
    ) {
        return;
    }


    const overlay =
        document.createElement("div");


    overlay.id =
        "tigerBonusOverlay";


    overlay.className =
        "tiger-bonus-overlay";


    overlay.innerHTML = `

        <div
            class="tiger-bonus-card"
            id="tigerBonusCard"
        >

            <div class="bonus-card-front">

                <div class="bonus-card-glow">
                    🃏
                </div>

                <strong>
                    CARTA BÔNUS
                </strong>

                <span>
                    O TIGRE ENCONTROU!
                </span>

            </div>


            <div class="bonus-card-back">

                <div class="bonus-icon">
                    🐯
                </div>

                <strong>
                    BÔNUS ESPECIAL
                </strong>

                <span>
                    CARTA REVELADA
                </span>

                <b id="bonusReward">
                    +R$ 0,00
                </b>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );
}


// ==========================================
// HISTÓRICO
// ==========================================

function addSpinHistory(
    results,
    amount,
    reward,
    isBonusSpin = false
) {

    spinHistory.unshift({

        symbols:
            results
                .map(result =>
                    result.symbol
                )
                .join(""),

        amount,

        reward,

        bonus:
            isBonusSpin,

        win:
            reward > 0
    });


    if (
        spinHistory.length > 20
    ) {

        spinHistory =
            spinHistory.slice(
                0,
                20
            );
    }


    renderSpinHistory();
}


// ==========================================
// RENDERIZAR HISTÓRICO
// ==========================================

function renderSpinHistory() {

    if (!spinHistoryElement) {
        return;
    }


    if (
        spinHistory.length === 0
    ) {

        spinHistoryElement.innerHTML = `

            <div class="history-empty">
                Nenhum giro realizado.
            </div>

        `;

        return;
    }


    spinHistoryElement.innerHTML =
        "";


    spinHistory.forEach(item => {

        const element =
            document.createElement("div");


        element.className =
            `history-item ${
                item.win
                    ? "win"
                    : "loss"
            }`;


        element.innerHTML = `

            <div class="history-symbols">
                ${item.symbols}
            </div>


            <div class="history-info">

                <small>

                    ${
                        item.bonus
                            ? "🔥 BÔNUS 10×"
                            : item.win
                                ? "GANHOU"
                                : "GIRO"
                    }

                </small>


                <strong>

                    ${
                        item.win
                            ? `+${formatBRL(item.reward)}`
                            : `-${formatBRL(item.amount)}`
                    }

                </strong>

            </div>

        `;


        spinHistoryElement
            .appendChild(element);

    });
}


// ==========================================
// MENSAGEM
// ==========================================

function showTigerMessage(
    message
) {

    if (!spinResult) {
        return;
    }


    spinResult.className =
        "spin-result loss";


    spinResult.textContent =
        message;
}


// ==========================================
// EVENTOS
// ==========================================

function setupTigerEvents() {

    document
        .querySelectorAll(".bet-adjust")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const direction =
                        button.dataset.action ===
                        "increase"
                            ? 1
                            : -1;


                    changeBet(direction);
                }
            );

        });


    if (spinButton) {

        spinButton.addEventListener(
            "click",
            () => {

                // Libera o áudio após
                // interação do usuário
                initAudio();

                spinTiger(false);
            }
        );
    }
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

function initializeTiger() {

    updateBetDisplay();

    updateTigerBalance();

    setupTigerEvents();

    createTenSpinBonusElements();
}


// ==========================================
// INICIAR
// ==========================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeTiger
    );

} else {

    initializeTiger();
}