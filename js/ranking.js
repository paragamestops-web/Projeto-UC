javascript
/* ==========================================
   BETZONE - RANKING
========================================== */


/* ==========================================
   FORMATAR DINHEIRO
========================================== */

function formatMoney(value) {

    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


/* ==========================================
   CARREGAR RANKING
========================================== */

function loadRanking() {

    const player = loadPlayer();


    /* ======================================
       HEADER
    ====================================== */

    const headerBalance =
        document.getElementById("headerBalance");

    if (headerBalance) {

        headerBalance.textContent =
            formatMoney(player.balance);

    }


    /* ======================================
       MEU PERFIL
    ====================================== */

    const myName =
        document.getElementById("myName");

    const myBalance =
        document.getElementById("myBalance");

    if (myName) {

        myName.textContent =
            player.name || "Jogador";

    }

    if (myBalance) {

        myBalance.textContent =
            formatMoney(player.balance);

    }


    /*
        Por enquanto existe somente o jogador
        salvo neste navegador.

        Quando conectarmos o banco de dados,
        esta lista será substituída pelos
        jogadores reais cadastrados.
    */

    const players = [
        {
            name: player.name || "Jogador",
            balance: Number(player.balance) || 0
        }
    ];


    /* ======================================
       ORDENAR
    ====================================== */

    players.sort((a, b) => {

        return b.balance - a.balance;

    });


    /* ======================================
       POSIÇÃO DO JOGADOR
    ====================================== */

    const myPosition =
        document.getElementById("myPosition");

    if (myPosition) {

        myPosition.textContent = "1º";

    }


    /* ======================================
       CONTADOR
    ====================================== */

    const playersCount =
        document.getElementById("playersCount");

    if (playersCount) {

        playersCount.textContent =
            `${players.length} jogador${players.length !== 1 ? "es" : ""}`;

    }


    /* ======================================
       TOP 3
    ====================================== */

    updatePodium(players);


    /* ======================================
       LISTA
    ====================================== */

    renderRanking(players);

}


/* ==========================================
   ATUALIZAR PÓDIO
========================================== */

function updatePodium(players) {

    const positions = [
        {
            index: 0,
            name: "firstName",
            balance: "firstBalance"
        },
        {
            index: 1,
            name: "secondName",
            balance: "secondBalance"
        },
        {
            index: 2,
            name: "thirdName",
            balance: "thirdBalance"
        }
    ];


    positions.forEach(position => {

        const player =
            players[position.index];

        const nameElement =
            document.getElementById(position.name);

        const balanceElement =
            document.getElementById(position.balance);


        if (!player) {

            if (nameElement) {
                nameElement.textContent = "—";
            }

            if (balanceElement) {
                balanceElement.textContent = "R$ 0,00";
            }

            return;
        }


        if (nameElement) {

            nameElement.textContent =
                player.name;

        }


        if (balanceElement) {

            balanceElement.textContent =
                formatMoney(player.balance);

        }

    });

}


/* ==========================================
   RENDERIZAR LISTA
========================================== */

function renderRanking(players) {

    const rankingList =
        document.getElementById("rankingList");


    if (!rankingList) return;


    rankingList.innerHTML = "";


    if (players.length === 0) {

        rankingList.innerHTML = `

            <div class="empty-ranking">

                <div class="empty-icon">
                    👥
                </div>

                <h3>
                    Ainda não existem jogadores
                </h3>

                <p>
                    Os jogadores cadastrados aparecerão
                    aqui.
                </p>

            </div>

        `;

        return;

    }


    players.forEach((player, index) => {

        const row =
            document.createElement("div");

        row.className =
            "ranking-row";


        row.innerHTML = `

            <div class="rank-number">
                #${index + 1}
            </div>

            <div class="rank-player">

                <div class="rank-avatar">
                    ${getInitial(player.name)}
                </div>

                <div>

                    <div class="rank-player-name">
                        ${escapeHTML(player.name)}
                    </div>

                    <span class="rank-player-label">
                        Jogador BetZone
                    </span>

                </div>

            </div>

            <div class="rank-balance">
                ${formatMoney(player.balance)}
            </div>

        `;


        rankingList.appendChild(row);

    });

}


/* ==========================================
   PRIMEIRA LETRA
========================================== */

function getInitial(name) {

    if (!name) return "?";

    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


/* ==========================================
   PROTEGER HTML
========================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ==========================================
   INICIAR
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    loadRanking
);
