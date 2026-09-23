// ==========================================
// BETZONE - PLAYER
// Controla os dados exibidos do jogador.
// ==========================================


// ==========================================
// ELEMENTOS DA INTERFACE
// ==========================================

const playerElements = {

    balance: document.getElementById("balance"),

    homeBalance: document.getElementById("homeBalance"),

    heroBalance: document.getElementById("heroBalance"),

    pageBalance: document.getElementById("pageBalance"),

    gameBalance: document.getElementById("gameBalance"),

    sideBalance: document.getElementById("sideBalance"),

    totalBets: document.getElementById("totalBets"),

    streak: document.getElementById("streak"),

    level: document.getElementById("level")

};


// ==========================================
// FORMATAR DINHEIRO
// ==========================================

function formatMoney(value) {

    const number = Number(value) || 0;

    return number.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL",

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    });
}


// ==========================================
// COMPATIBILIDADE
// ==========================================
// Alguns arquivos antigos do projeto usam
// formatPoints().
// Agora ela também mostra R$.
// ==========================================

function formatPoints(value) {

    return formatMoney(value);

}


// ==========================================
// ATUALIZAR SALDO
// ==========================================

function updateBalance(player) {

    const formatted = formatMoney(player.balance);


    // Saldo da barra superior

    if (playerElements.balance) {

        playerElements.balance.textContent =
            formatted;

    }


    // Saldo da página inicial

    if (playerElements.homeBalance) {

        playerElements.homeBalance.textContent =
            formatted;

    }


    // Saldo do Hero

    if (playerElements.heroBalance) {

        playerElements.heroBalance.textContent =
            formatted;

    }


    // Saldo da página de palpites

    if (playerElements.pageBalance) {

        playerElements.pageBalance.textContent =
            formatted;

    }


    // Saldo dos jogos

    if (playerElements.gameBalance) {

        playerElements.gameBalance.textContent =
            formatted;

    }


    // Saldo lateral do Mines

    if (playerElements.sideBalance) {

        playerElements.sideBalance.textContent =
            formatted;

    }

}


// ==========================================
// ATUALIZAR ESTATÍSTICAS
// ==========================================

function updatePlayerStats(player) {

    if (playerElements.totalBets) {

        playerElements.totalBets.textContent =
            player.bets;

    }


    if (playerElements.streak) {

        playerElements.streak.textContent =
            player.streak;

    }


    if (playerElements.level) {

        playerElements.level.textContent =
            player.level;

    }

}


// ==========================================
// ATUALIZAR TUDO
// ==========================================

function updatePlayerUI() {

    const player = loadPlayer();

    updateBalance(player);
    updatePlayerStats(player);

}


// ==========================================
// ADICIONAR DINHEIRO VIRTUAL
// ==========================================

function giveMoney(amount) {

    amount = Number(amount);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return false;

    }


    const player = addBalance(amount);

    updatePlayerUI();


    return player;

}


// ==========================================
// REMOVER DINHEIRO VIRTUAL
// ==========================================

function removeMoney(amount) {

    amount = Number(amount);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return false;

    }


    const player = loadPlayer();


    // Não permite gastar mais
    // do que o saldo disponível.

    if (player.balance < amount) {

        return false;

    }


    addBalance(-amount);

    updatePlayerUI();


    return true;

}


// ==========================================
// COMPATIBILIDADE
// Mantém as funções antigas funcionando.
// ==========================================

function givePoints(amount) {

    return giveMoney(amount);

}


function removePoints(amount) {

    return removeMoney(amount);

}


// ==========================================
// REGISTRAR PALPITE
// ==========================================

function registerBet(data) {

    const player = loadPlayer();

    player.bets++;


    const historyEntry = {

        type: "bet",

        matchId: data.matchId,

        selection: data.selection,

        amount: Number(data.amount),

        odd: Number(data.odd),

        result: "pending",

        date: new Date().toISOString()

    };


    player.history.unshift(
        historyEntry
    );


    // Limita o histórico

    if (player.history.length > 100) {

        player.history =
            player.history.slice(0, 100);

    }


    savePlayer(player);

    updatePlayerUI();


    return player;

}


// ==========================================
// REGISTRAR ACERTO
// ==========================================

function registerWin(
    reward,
    betData = {}
) {

    const player = loadPlayer();

    reward = Number(reward);


    if (
        !Number.isFinite(reward) ||
        reward < 0
    ) {

        reward = 0;

    }


    player.wins++;

    player.streak++;


    if (
        player.streak >
        player.bestStreak
    ) {

        player.bestStreak =
            player.streak;

    }


    // Adiciona o prêmio
    // ao saldo virtual.

    player.balance += reward;


    // Corrige casas decimais.

    player.balance =
        Math.round(
            player.balance * 100
        ) / 100;


    // Atualiza o último registro.

    if (
        player.history.length > 0
    ) {

        const last =
            player.history[0];


        if (
            last.result === "pending"
        ) {

            last.result = "win";

            last.reward = reward;

        }

    }


    savePlayer(player);


    const xpResult =
        addXP(25);


    updatePlayerUI();


    return {

        player:
            xpResult.player,

        leveledUp:
            xpResult.leveledUp

    };

}


// ==========================================
// REGISTRAR DERROTA
// ==========================================

function registerLoss() {

    const player = loadPlayer();

    player.losses++;

    player.streak = 0;


    if (
        player.history.length > 0
    ) {

        const last =
            player.history[0];


        if (
            last.result === "pending"
        ) {

            last.result = "loss";

        }

    }


    savePlayer(player);

    addXP(5);

    updatePlayerUI();


    return player;

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updatePlayerUI();

    }
);