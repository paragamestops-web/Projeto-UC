// ==========================================
// BETZONE - MATCHES
// Sistema de partidas e bilhete
// SIMULAÇÃO
// ==========================================

const MATCHES = [

    {
        id: 1,
        category: "brasil",
        league: "CAMPEONATO BRASILEIRO",
        home: "Flamengo",
        away: "Palmeiras",
        homeIcon: "🔴",
        awayIcon: "🟢",
        time: "19:00",
        odds: {
            home: 2.10,
            draw: 3.40,
            away: 2.80
        }
    },

    {
        id: 2,
        category: "international",
        league: "CHAMPIONS CUP",
        home: "Real Madrid",
        away: "Manchester City",
        homeIcon: "⚪",
        awayIcon: "🔵",
        time: "21:00",
        odds: {
            home: 2.30,
            draw: 3.60,
            away: 2.50
        }
    },

    {
        id: 3,
        category: "international",
        league: "SUPER LEAGUE",
        home: "Barcelona",
        away: "Bayern",
        homeIcon: "🔵",
        awayIcon: "🔴",
        time: "16:30",
        odds: {
            home: 1.90,
            draw: 3.70,
            away: 3.10
        }
    },

    {
        id: 4,
        category: "international",
        league: "ELITE CUP",
        home: "Liverpool",
        away: "Milan",
        homeIcon: "🔴",
        awayIcon: "⚫",
        time: "18:45",
        odds: {
            home: 2.00,
            draw: 3.20,
            away: 3.00
        }
    },

    {
        id: 5,
        category: "brasil",
        league: "CAMPEONATO BRASILEIRO",
        home: "Corinthians",
        away: "Grêmio",
        homeIcon: "⚫",
        awayIcon: "🔵",
        time: "20:00",
        odds: {
            home: 2.20,
            draw: 3.10,
            away: 2.90
        }
    },

    {
        id: 6,
        category: "brasil",
        league: "COPA NACIONAL",
        home: "São Paulo",
        away: "Cruzeiro",
        homeIcon: "🔴",
        awayIcon: "🔵",
        time: "20:30",
        odds: {
            home: 2.00,
            draw: 3.30,
            away: 3.20
        }
    },

    {
        id: 7,
        category: "cup",
        league: "WORLD CUP",
        home: "Argentina",
        away: "France",
        homeIcon: "🇦🇷",
        awayIcon: "🇫🇷",
        time: "22:00",
        odds: {
            home: 2.40,
            draw: 3.20,
            away: 2.50
        }
    },

    {
        id: 8,
        category: "cup",
        league: "WORLD CUP",
        home: "Brazil",
        away: "Germany",
        homeIcon: "🇧🇷",
        awayIcon: "🇩🇪",
        time: "18:00",
        odds: {
            home: 1.80,
            draw: 3.60,
            away: 3.70
        }
    }

];


// ==========================================
// ESTADO
// ==========================================

let ticketSelections = [];
let currentFilter = "all";


// ==========================================
// ELEMENTOS
// ==========================================

const matchesContainer =
    document.getElementById("matchesContainer");

const ticketSelectionsElement =
    document.getElementById("ticketSelections");

const ticketEmpty =
    document.getElementById("ticketEmpty");

const ticketCount =
    document.getElementById("ticketCount");

const ticketOdd =
    document.getElementById("ticketOdd");

const ticketAmount =
    document.getElementById("ticketAmount");

const possibleReward =
    document.getElementById("possibleReward");

const confirmTicket =
    document.getElementById("confirmTicket");

const clearTicket =
    document.getElementById("clearTicket");


// ==========================================
// FORMATAÇÃO R$
// ==========================================

function formatMoney(value) {

    return Number(value || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ==========================================
// RENDERIZAR PARTIDAS
// ==========================================

function renderMatches() {

    if (!matchesContainer) {
        return;
    }

    const filtered = MATCHES.filter(match => {

        if (currentFilter === "all") {
            return true;
        }

        return match.category === currentFilter;

    });

    matchesContainer.innerHTML = "";

    filtered.forEach(match => {

        const card = createMatchCard(match);

        matchesContainer.appendChild(card);

    });

    updateSelectedButtons();

}


// ==========================================
// CRIAR CARD
// ==========================================

function createMatchCard(match) {

    const article =
        document.createElement("article");

    article.className = "match-card";

    article.dataset.category =
        match.category;

    article.dataset.id =
        match.id;


    article.innerHTML = `

        <div class="match-top">

            <span class="match-league">
                ${match.league}
            </span>

            <span class="match-status">
                ABERTO
            </span>

        </div>


        <div class="match-teams">

            <div class="team">

                <div class="team-icon">
                    ${match.homeIcon}
                </div>

                <span class="team-name">
                    ${match.home}
                </span>

            </div>


            <div class="match-vs">
                VS
            </div>


            <div class="team">

                <div class="team-icon">
                    ${match.awayIcon}
                </div>

                <span class="team-name">
                    ${match.away}
                </span>

            </div>

        </div>


        <div class="odds">

            <button
                class="odd-button"
                data-match="${match.id}"
                data-option="home"
            >

                <span class="odd-label">
                    ${match.home}
                </span>

                <strong class="odd-value">
                    ${match.odds.home.toFixed(2)}
                </strong>

            </button>


            <button
                class="odd-button"
                data-match="${match.id}"
                data-option="draw"
            >

                <span class="odd-label">
                    EMPATE
                </span>

                <strong class="odd-value">
                    ${match.odds.draw.toFixed(2)}
                </strong>

            </button>


            <button
                class="odd-button"
                data-match="${match.id}"
                data-option="away"
            >

                <span class="odd-label">
                    ${match.away}
                </span>

                <strong class="odd-value">
                    ${match.odds.away.toFixed(2)}
                </strong>

            </button>

        </div>


        <div class="match-time">
            🕒 Hoje às ${match.time}
        </div>


        <div
            class="match-result"
            id="result-${match.id}"
        ></div>

    `;


    article
        .querySelectorAll(".odd-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectMatch(
                        match.id,
                        button.dataset.option
                    );

                }
            );

        });


    return article;

}


// ==========================================
// SELECIONAR PALPITE
// ==========================================

function selectMatch(matchId, option) {

    const match =
        MATCHES.find(
            item => item.id === matchId
        );

    if (!match) {
        return;
    }


    const existingIndex =
        ticketSelections.findIndex(
            item => item.matchId === matchId
        );


    const selection = {

        matchId,

        option,

        league: match.league,

        home: match.home,

        away: match.away,

        selectionName:
            getSelectionName(
                match,
                option
            ),

        odd:
            match.odds[option]

    };


    if (existingIndex >= 0) {

        ticketSelections[existingIndex] =
            selection;

    } else {

        ticketSelections.push(
            selection
        );

    }


    renderTicket();

    updateSelectedButtons();

}


// ==========================================
// NOME DA SELEÇÃO
// ==========================================

function getSelectionName(match, option) {

    if (option === "home") {
        return match.home;
    }

    if (option === "away") {
        return match.away;
    }

    return "Empate";

}


// ==========================================
// ATUALIZAR BOTÕES
// ==========================================

function updateSelectedButtons() {

    document
        .querySelectorAll(".odd-button")
        .forEach(button => {

            const matchId =
                Number(button.dataset.match);

            const option =
                button.dataset.option;

            const selected =
                ticketSelections.find(
                    item =>
                        item.matchId === matchId &&
                        item.option === option
                );

            button.classList.toggle(
                "selected",
                Boolean(selected)
            );

        });

}


// ==========================================
// RENDERIZAR BILHETE
// ==========================================

function renderTicket() {

    if (!ticketSelectionsElement) {
        return;
    }


    if (ticketSelections.length === 0) {

        ticketEmpty.style.display = "block";

        ticketSelectionsElement.innerHTML = "";

    } else {

        ticketEmpty.style.display = "none";

        ticketSelectionsElement.innerHTML = "";


        ticketSelections.forEach(selection => {

            const element =
                createTicketSelection(selection);

            ticketSelectionsElement
                .appendChild(element);

        });

    }


    updateTicketTotals();

}


// ==========================================
// CRIAR SELEÇÃO
// ==========================================

function createTicketSelection(selection) {

    const element =
        document.createElement("div");

    element.className =
        "ticket-selection";


    element.innerHTML = `

        <div class="ticket-selection-top">

            <span class="ticket-selection-league">
                ${selection.league}
            </span>

            <button
                class="remove-selection"
                data-remove="${selection.matchId}"
            >
                ×
            </button>

        </div>


        <div class="ticket-match">

            ${selection.home}

            <span style="color:#8993a3">
                ×
            </span>

            ${selection.away}

        </div>


        <div class="ticket-pick">

            <span>
                ${selection.selectionName}
            </span>

            <strong>
                ${selection.odd.toFixed(2)}
            </strong>

        </div>

    `;


    element
        .querySelector(".remove-selection")
        .addEventListener(
            "click",
            () => {

                removeSelection(
                    selection.matchId
                );

            }
        );


    return element;

}


// ==========================================
// REMOVER
// ==========================================

function removeSelection(matchId) {

    ticketSelections =
        ticketSelections.filter(
            item =>
                item.matchId !== matchId
        );

    renderTicket();

    updateSelectedButtons();

}


// ==========================================
// LIMPAR
// ==========================================

function clearTicketData() {

    ticketSelections = [];

    renderTicket();

    updateSelectedButtons();

}


// ==========================================
// MULTIPLICADOR
// ==========================================

function calculateTotalOdd() {

    if (ticketSelections.length === 0) {
        return 0;
    }


    return ticketSelections.reduce(
        (total, selection) => {

            return total * selection.odd;

        },
        1
    );

}


// ==========================================
// ATUALIZAR TOTAIS
// ==========================================

function updateTicketTotals() {

    const totalOdd =
        calculateTotalOdd();


    const amount =
        Number(
            ticketAmount?.value || 0
        );


    const reward =
        amount > 0
            ? amount * totalOdd
            : 0;


    if (ticketCount) {

        ticketCount.textContent =
            ticketSelections.length;

    }


    if (ticketOdd) {

        ticketOdd.textContent =
            totalOdd
                ? totalOdd.toFixed(2)
                : "0.00";

    }


    if (possibleReward) {

        possibleReward.textContent =
            formatMoney(reward);

    }


    if (confirmTicket) {

        confirmTicket.disabled =
            ticketSelections.length === 0;

    }

}


// ==========================================
// CONFIRMAR
// ==========================================

function confirmTicketData() {

    if (ticketSelections.length === 0) {

        showMatchMessage(
            "Selecione pelo menos um resultado."
        );

        return;
    }


    const amount =
        Number(ticketAmount.value);


    if (!amount || amount < 10) {

        showMatchMessage(
            "O valor mínimo é R$ 10,00."
        );

        return;
    }


    if (amount > 500) {

        showMatchMessage(
            "O limite é R$ 500,00."
        );

        return;
    }


    const player =
        loadPlayer();


    if (amount > player.balance) {

        showMatchMessage(
            "Você não possui saldo suficiente."
        );

        return;
    }


    // Remove do saldo SIMULADO.

    addBalance(-amount);


    // Registra as seleções.

    ticketSelections.forEach(selection => {

        registerBet({

            matchId:
                selection.matchId,

            selection:
                selection.selectionName,

            amount,

            odd:
                selection.odd

        });

    });


    // Resultado simulado.

    const won =
        Math.random() >= 0.5;


    const totalOdd =
        calculateTotalOdd();


    const reward =
        Math.floor(
            amount * totalOdd
        );


    if (won) {

        const result =
            registerWin(reward);


        showMatchMessage(
            `🎉 Bilhete acertado! +${formatMoney(reward)}`
        );


        if (result.leveledUp) {

            showMatchMessage(
                `🏆 Você subiu para o nível ${result.player.level}!`
            );

        }

    } else {

        registerLoss();


        showMatchMessage(
            "😅 Bilhete não acertado desta vez."
        );

    }


    showTicketResults(
        won,
        reward
    );


    ticketSelections = [];

    renderTicket();

    updateSelectedButtons();

    updateMatchBalance();

}


// ==========================================
// RESULTADO
// ==========================================

function showTicketResults(won, reward) {

    document
        .querySelectorAll(".match-result")
        .forEach(element => {

            element.classList.remove(
                "show",
                "win",
                "loss"
            );


            element.classList.add(
                "show",
                won ? "win" : "loss"
            );


            element.textContent =
                won
                    ? `🎉 Bilhete vencedor! +${formatMoney(reward)}`
                    : "❌ Bilhete não acertado.";

        });

}


// ==========================================
// SALDO
// ==========================================

function updateMatchBalance() {

    const player =
        loadPlayer();


    const formatted =
        formatMoney(player.balance);


    const balance =
        document.getElementById("balance");


    const pageBalance =
        document.getElementById("pageBalance");


    if (balance) {

        balance.textContent =
            formatted;

    }


    if (pageBalance) {

        pageBalance.textContent =
            formatted;

    }

}


// ==========================================
// FILTROS
// ==========================================

function setupFilters() {

    document
        .querySelectorAll(".filter")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".filter")
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    renderMatches();

                }
            );

        });

}


// ==========================================
// EVENTOS
// ==========================================

function setupMatchEvents() {

    if (clearTicket) {

        clearTicket.addEventListener(
            "click",
            clearTicketData
        );

    }


    if (ticketAmount) {

        ticketAmount.addEventListener(
            "input",
            updateTicketTotals
        );

    }


    if (confirmTicket) {

        confirmTicket.addEventListener(
            "click",
            confirmTicketData
        );

    }

}


// ==========================================
// MENSAGEM
// ==========================================

function showMatchMessage(message) {

    let element =
        document.querySelector(
            ".match-message"
        );


    if (!element) {

        element =
            document.createElement("div");


        element.className =
            "match-message";


        Object.assign(
            element.style,
            {

                position: "fixed",

                right: "25px",

                bottom: "25px",

                zIndex: "9999",

                padding: "15px 20px",

                background: "#11161e",

                border:
                    "1px solid #242b36",

                borderRadius: "10px",

                color: "#f5f7fa",

                fontSize: "13px",

                fontWeight: "700",

                boxShadow:
                    "0 15px 40px rgba(0,0,0,.35)"

            }
        );


        document.body.appendChild(
            element
        );

    }


    element.textContent =
        message;


    element.style.opacity =
        "1";


    clearTimeout(
        element._timeout
    );


    element._timeout =
        setTimeout(() => {

            element.style.opacity =
                "0";

        }, 3000);

}


// ==========================================
// INICIAR
// ==========================================

function initializeMatches() {

    renderMatches();

    setupFilters();

    setupMatchEvents();

    updateMatchBalance();

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMatches
    );

} else {

    initializeMatches();

}