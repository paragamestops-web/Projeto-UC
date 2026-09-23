// ==========================================
// BETZONE - MINES
// Minigame com saldo em R$
// ==========================================

const GRID_SIZE = 25;

// ==========================================
// ESTADO DA RODADA
// ==========================================

let mineAmount = 5;
let betAmount = 50;

let mines = [];
let revealed = [];

let diamondsFound = 0;
let currentScore = 0;

let gameOver = false;
let roundActive = false;

// ==========================================
// ELEMENTOS
// ==========================================

const grid =
    document.getElementById("mineGrid");

const mineSelector =
    document.getElementById("mineSelector");

const betSelector =
    document.getElementById("betSelector");

const mineCountElement =
    document.getElementById("mineCount");

const safeCountElement =
    document.getElementById("safeCount");

const currentScoreElement =
    document.getElementById("currentScore");

const currentBetElement =
    document.getElementById("currentBet");

const pointsPerDiamondElement =
    document.getElementById("pointsPerDiamond");

const messageElement =
    document.getElementById("mineMessage");

const newGameButton =
    document.getElementById("newGame");

const cashOutButton =
    document.getElementById("cashOut");

const cashOutValue =
    document.getElementById("cashOutValue");

const bestScoreElement =
    document.getElementById("bestScore");

const difficultyElement =
    document.getElementById("difficulty");

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");

const gameBalance =
    document.getElementById("gameBalance");

const sideBalance =
    document.getElementById("sideBalance");

// ==========================================
// FORMATAÇÃO EM R$
// ==========================================

function formatBRL(value) {

    const number = Number(value) || 0;

    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ==========================================
// RECORD
// ==========================================

let bestScore =
    Number(
        localStorage.getItem(
            "betzone_mines_record"
        )
    ) || 0;

if (bestScoreElement) {

    bestScoreElement.textContent =
        formatBRL(bestScore);
}

// ==========================================
// MULTIPLICADORES
// ==========================================

function getMineMultiplier() {

    switch (mineAmount) {

        case 3:
            return 1.25;

        case 5:
            return 1.50;

        case 7:
            return 1.75;

        case 10:
            return 2.10;

        case 12:
            return 2.40;

        case 15:
            return 2.80;

        case 18:
            return 3.40;

        case 20:
            return 4.00;

        case 22:
            return 4.50;

        case 24:
            return 5.00;

        default:
            return 1.50;
    }
}

// ==========================================
// VALOR DO DIAMANTE
// ==========================================

function getDiamondPoints() {

    return Math.round(
        betAmount *
        getMineMultiplier()
    );
}

// ==========================================
// DIFICULDADE
// ==========================================

function updateDifficulty() {

    if (mineAmount <= 3) {

        difficultyElement.textContent =
            "FÁCIL";

    } else if (mineAmount <= 5) {

        difficultyElement.textContent =
            "MÉDIA";

    } else if (mineAmount <= 10) {

        difficultyElement.textContent =
            "DIFÍCIL";

    } else {

        difficultyElement.textContent =
            "EXTREMA";
    }
}

// ==========================================
// ATUALIZAR VALOR DO DIAMANTE
// ==========================================

function updateDiamondValue() {

    const value =
        getDiamondPoints();

    if (pointsPerDiamondElement) {

        pointsPerDiamondElement.textContent =
            `+${formatBRL(value)}`;
    }
}

// ==========================================
// CRIAR MINAS
// ==========================================

function generateMines() {

    mines = [];

    while (
        mines.length < mineAmount
    ) {

        const position =
            Math.floor(
                Math.random() * GRID_SIZE
            );

        if (
            !mines.includes(position)
        ) {

            mines.push(position);
        }
    }
}

// ==========================================
// CRIAR TABULEIRO
// ==========================================

function createGrid() {

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    revealed = [];

    diamondsFound = 0;

    for (
        let i = 0;
        i < GRID_SIZE;
        i++
    ) {

        const cell =
            document.createElement("button");

        cell.type = "button";

        cell.className =
            "mine-cell";

        cell.dataset.index = i;

        cell.textContent = "✦";

        cell.addEventListener(
            "click",
            () => revealCell(i, cell)
        );

        grid.appendChild(cell);
    }
}

// ==========================================
// INICIAR RODADA
// ==========================================

function startGame() {

    if (roundActive) {
        return;
    }

    betAmount =
        Number(betSelector.value);

    mineAmount =
        Number(mineSelector.value);

    const player =
        loadPlayer();

    // ======================================
    // VERIFICAR SALDO
    // ======================================

    if (
        player.balance < betAmount
    ) {

        showMessage(
            "💰 Saldo insuficiente para essa aposta.",
            "danger"
        );

        return;
    }

    // ======================================
    // RETIRAR APOSTA
    // ======================================

    const removed =
        removeMoney(betAmount);

    if (!removed) {

        showMessage(
            "Não foi possível realizar a aposta.",
            "danger"
        );

        return;
    }

    // ======================================
    // ESTADO
    // ======================================

    currentScore = 0;

    diamondsFound = 0;

    gameOver = false;

    roundActive = true;

    generateMines();

    createGrid();

    updateInterface();

    updateDifficulty();

    updateDiamondValue();

    updateBalanceDisplays();

    // ======================================
    // BLOQUEAR CONFIGURAÇÕES
    // ======================================

    betSelector.disabled = true;

    mineSelector.disabled = true;

    // ======================================
    // BOTÕES
    // ======================================

    newGameButton.disabled = true;

    cashOutButton.disabled = true;

    cashOutValue.textContent =
        "R$ 0,00";

    showMessage(
        "Escolha uma casa para começar.",
        ""
    );
}

// ==========================================
// REVELAR CASA
// ==========================================

function revealCell(index, cell) {

    if (!roundActive) {
        return;
    }

    if (gameOver) {
        return;
    }

    if (revealed.includes(index)) {
        return;
    }

    revealed.push(index);

    cell.classList.add("revealed");

    // ======================================
    // MINA
    // ======================================

    if (mines.includes(index)) {

        cell.classList.add("mine");

        cell.textContent = "💣";

        gameOver = true;

        roundActive = false;

        revealMines();

        currentScore = 0;

        showMessage(
            "💥 Mina encontrada! A aposta desta rodada foi perdida.",
            "danger"
        );

        updateInterface();

        finishRound();

        return;
    }

    // ======================================
    // DIAMANTE
    // ======================================

    cell.classList.add("safe");

    cell.textContent = "💎";

    diamondsFound++;

    const points =
        getDiamondPoints();

    currentScore += points;

    showMessage(
        `💎 +${formatBRL(points)}`,
        "success"
    );

    updateInterface();

    // ======================================
    // LIBERAR RESGATE
    // ======================================

    if (
        diamondsFound > 0 &&
        currentScore > 0
    ) {

        cashOutButton.disabled = false;

        cashOutValue.textContent =
            formatBRL(currentScore);
    }

    // ======================================
    // TODAS AS CASAS SEGURAS
    // ======================================

    const safeTotal =
        GRID_SIZE - mineAmount;

    if (
        diamondsFound >= safeTotal
    ) {

        cashOut();
    }
}

// ==========================================
// REVELAR MINAS
// ==========================================

function revealMines() {

    const cells =
        document.querySelectorAll(
            ".mine-cell"
        );

    mines.forEach(index => {

        const cell =
            cells[index];

        if (
            !cell.classList.contains(
                "revealed"
            )
        ) {

            cell.classList.add(
                "mine"
            );

            cell.textContent = "💣";
        }
    });
}

// ==========================================
// RESGATAR
// ==========================================

function cashOut() {

    if (!roundActive) {
        return;
    }

    if (currentScore <= 0) {
        return;
    }

    const payout =
        currentScore;

    // ======================================
    // DEVOLVE AO SALDO
    // ======================================

    giveMoney(payout);

    // ======================================
    // ESTADO
    // ======================================

    gameOver = true;

    roundActive = false;

    // ======================================
    // RECORD
    // ======================================

    updateBestScore(payout);

    // ======================================
    // HISTÓRICO
    // ======================================

    addHistory({

        type: "mines",

        amount: betAmount,

        mines: mineAmount,

        diamonds: diamondsFound,

        reward: payout,

        result: "cashout",

        date:
            new Date().toISOString()
    });

    showMessage(
        `💰 Resgate realizado! +${formatBRL(payout)}`,
        "success"
    );

    revealSafeCells();

    finishRound();

    updateInterface();

    updateBalanceDisplays();

    cashOutButton.disabled = true;

    cashOutValue.textContent =
        "RESGATADO";
}

// ==========================================
// REVELAR DIAMANTES RESTANTES
// ==========================================

function revealSafeCells() {

    const cells =
        document.querySelectorAll(
            ".mine-cell"
        );

    for (
        let i = 0;
        i < GRID_SIZE;
        i++
    ) {

        if (
            !mines.includes(i)
        ) {

            const cell =
                cells[i];

            if (
                !cell.classList.contains(
                    "revealed"
                )
            ) {

                cell.classList.add(
                    "safe"
                );

                cell.textContent = "💎";
            }
        }
    }
}

// ==========================================
// FINALIZAR RODADA
// ==========================================

function finishRound() {

    betSelector.disabled = false;

    mineSelector.disabled = false;

    newGameButton.disabled = false;

    newGameButton.textContent =
        "🔄 NOVA RODADA";

    cashOutButton.disabled = true;
}

// ==========================================
// INTERFACE
// ==========================================

function updateInterface() {

    const safeTotal =
        GRID_SIZE - mineAmount;

    mineCountElement.textContent =
        mineAmount;

    safeCountElement.textContent =
        diamondsFound;

    currentBetElement.textContent =
        formatBRL(betAmount);

    currentScoreElement.textContent =
        formatBRL(currentScore);

    const progress =
        safeTotal > 0
            ? Math.round(
                (
                    diamondsFound /
                    safeTotal
                ) * 100
            )
            : 0;

    progressText.textContent =
        `${progress}%`;

    progressFill.style.width =
        `${progress}%`;

    cashOutValue.textContent =
        currentScore > 0
            ? formatBRL(currentScore)
            : "R$ 0,00";
}

// ==========================================
// ATUALIZAR SALDOS
// ==========================================

function updateBalanceDisplays() {

    const player =
        loadPlayer();

    const formatted =
        formatBRL(player.balance);

    // Saldo do jogo
    if (gameBalance) {

        gameBalance.textContent =
            formatted;
    }

    // Saldo lateral
    if (sideBalance) {

        sideBalance.textContent =
            formatted;
    }

    // Atualiza também o restante da interface
    updatePlayerUI();
}

// ==========================================
// RECORD
// ==========================================

function updateBestScore(score) {

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "betzone_mines_record",
            bestScore
        );

        if (bestScoreElement) {

            bestScoreElement.textContent =
                formatBRL(bestScore);
        }
    }
}

// ==========================================
// MENSAGEM
// ==========================================

function showMessage(
    text,
    type
) {

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        text;

    messageElement.className =
        "mine-message";

    if (type) {

        messageElement.classList.add(
            type
        );
    }
}

// ==========================================
// ALTERAR APOSTA
// ==========================================

betSelector.addEventListener(
    "change",
    () => {

        if (roundActive) {
            return;
        }

        betAmount =
            Number(
                betSelector.value
            );

        updateInterface();

        updateDiamondValue();
    }
);

// ==========================================
// ALTERAR MINAS
// ==========================================

mineSelector.addEventListener(
    "change",
    () => {

        if (roundActive) {
            return;
        }

        mineAmount =
            Number(
                mineSelector.value
            );

        updateDifficulty();

        updateDiamondValue();

        updateInterface();
    }
);

// ==========================================
// NOVA RODADA
// ==========================================

newGameButton.addEventListener(
    "click",
    () => {

        if (roundActive) {
            return;
        }

        startGame();
    }
);

// ==========================================
// RESGATAR
// ==========================================

cashOutButton.addEventListener(
    "click",
    () => {

        cashOut();
    }
);

// ==========================================
// INICIALIZAÇÃO
// ==========================================

function initializeMines() {

    betAmount =
        Number(
            betSelector.value
        );

    mineAmount =
        Number(
            mineSelector.value
        );

    updateDifficulty();

    updateDiamondValue();

    updateInterface();

    updateBalanceDisplays();

    showMessage(
        "Escolha sua aposta e comece uma rodada.",
        ""
    );

    cashOutButton.disabled = true;
}

// ==========================================
// INICIAR
// ==========================================

initializeMines();