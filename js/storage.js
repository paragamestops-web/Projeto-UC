// ==========================================
// BETZONE - STORAGE
// Responsável por salvar e carregar os dados
// do jogador no navegador.
// ==========================================

const STORAGE_KEY = "betzone_player";

const DEFAULT_PLAYER = {
    name: "Jogador",

    // Saldo virtual em reais
    balance: 1000,

    bets: 0,
    wins: 0,
    losses: 0,

    streak: 0,
    bestStreak: 0,

    level: 1,
    xp: 0,

    createdAt: new Date().toISOString(),

    history: [],

    achievements: []
};


// ==========================================
// CARREGAR JOGADOR
// ==========================================

function loadPlayer() {

    try {

        const savedData = localStorage.getItem(STORAGE_KEY);

        // Se não existir jogador salvo,
        // cria uma nova conta.

        if (!savedData) {

            const newPlayer = {
                ...DEFAULT_PLAYER
            };

            savePlayer(newPlayer);

            return newPlayer;
        }

        const player = JSON.parse(savedData);

        // Garante que propriedades novas
        // existam em contas antigas.

        return {
            ...DEFAULT_PLAYER,
            ...player
        };

    } catch (error) {

        console.error(
            "Erro ao carregar jogador:",
            error
        );

        const newPlayer = {
            ...DEFAULT_PLAYER
        };

        savePlayer(newPlayer);

        return newPlayer;
    }
}


// ==========================================
// SALVAR JOGADOR
// ==========================================

function savePlayer(player) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(player)
        );

        return true;

    } catch (error) {

        console.error(
            "Erro ao salvar jogador:",
            error
        );

        return false;
    }
}


// ==========================================
// RESETAR JOGADOR
// ==========================================

function resetPlayer() {

    localStorage.removeItem(STORAGE_KEY);

    return loadPlayer();
}


// ==========================================
// ATUALIZAR DADOS
// ==========================================

function updatePlayer(updates) {

    const player = loadPlayer();

    const updatedPlayer = {
        ...player,
        ...updates
    };

    savePlayer(updatedPlayer);

    return updatedPlayer;
}


// ==========================================
// ADICIONAR HISTÓRICO
// ==========================================

function addHistory(entry) {

    const player = loadPlayer();

    player.history.unshift(entry);

    // Mantém no máximo os últimos 100 registros.

    if (player.history.length > 100) {

        player.history =
            player.history.slice(0, 100);
    }

    savePlayer(player);

    return player;
}


// ==========================================
// ADICIONAR XP
// ==========================================

function addXP(amount) {

    const player = loadPlayer();

    player.xp += Number(amount);

    let leveledUp = false;

    while (
        player.xp >= getRequiredXP(player.level)
    ) {

        player.xp -=
            getRequiredXP(player.level);

        player.level++;

        leveledUp = true;
    }

    savePlayer(player);

    return {
        player,
        leveledUp
    };
}


// ==========================================
// XP NECESSÁRIO
// ==========================================

function getRequiredXP(level) {

    return 100 + ((level - 1) * 50);
}


// ==========================================
// ADICIONAR PONTOS AO SALDO
// ==========================================

function addBalance(amount) {

    const player = loadPlayer();

    player.balance += Number(amount);

    // Nunca deixa o saldo ficar negativo.

    if (player.balance < 0) {

        player.balance = 0;
    }

    // Evita problemas de casas decimais
    // causados pelo JavaScript.

    player.balance =
        Math.round(player.balance * 100) / 100;

    savePlayer(player);

    return player;
}


// ==========================================
// VERIFICAR CONQUISTA
// ==========================================

function hasAchievement(id) {

    const player = loadPlayer();

    return player.achievements.includes(id);
}


// ==========================================
// ADICIONAR CONQUISTA
// ==========================================

function addAchievement(id) {

    const player = loadPlayer();

    if (!player.achievements.includes(id)) {

        player.achievements.push(id);

        savePlayer(player);

        return true;
    }

    return false;
}