// ==========================================
// BETZONE - APP
// Controlador principal da aplicação
// ==========================================


// ==========================================
// CONFIGURAÇÃO
// ==========================================

const APP = {

    name: "BetZone",

    version: "1.0.0",

    initialized: false

};


// ==========================================
// INICIALIZAÇÃO
// ==========================================

function initializeApp() {

    if (APP.initialized) {
        return;
    }

    APP.initialized = true;

    console.log(
        `${APP.name} v${APP.version} iniciado.`
    );

    updateNavigation();

    updateGlobalPlayer();

    setupGlobalEvents();

}


// ==========================================
// ATUALIZAR NAVEGAÇÃO
// ==========================================

function updateNavigation() {

    const currentPage =
        window.location.pathname;

    const links =
        document.querySelectorAll(".nav-link");

    links.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        const linkPath =
            new URL(
                href,
                window.location.href
            ).pathname;

        link.classList.remove("active");

        if (
            linkPath === currentPage ||
            (
                currentPage.endsWith("/") &&
                href === "index.html"
            )
        ) {

            link.classList.add("active");

        }

    });

}


// ==========================================
// ATUALIZAR DADOS GLOBAIS
// ==========================================

function updateGlobalPlayer() {

    if (
        typeof updatePlayerUI ===
        "function"
    ) {

        updatePlayerUI();

    }

}


// ==========================================
// EVENTOS GLOBAIS
// ==========================================

function setupGlobalEvents() {

    document.addEventListener(
        "click",
        handleGlobalClick
    );

}


// ==========================================
// CLIQUES GLOBAIS
// ==========================================

function handleGlobalClick(event) {

    const element =
        event.target.closest(
            "[data-action]"
        );

    if (!element) {
        return;
    }

    const action =
        element.dataset.action;

    switch (action) {

        case "reset-player":

            handleResetPlayer();

            break;

        case "refresh-player":

            updateGlobalPlayer();

            break;

        default:

            console.warn(
                `Ação desconhecida: ${action}`
            );

    }

}


// ==========================================
// RESETAR CONTA
// ==========================================

function handleResetPlayer() {

    const confirmed =
        window.confirm(
            "Tem certeza que deseja resetar todos os seus dados?"
        );

    if (!confirmed) {
        return;
    }

    resetPlayer();

    updateGlobalPlayer();

    showAppMessage(
        "Dados resetados com sucesso."
    );

    setTimeout(() => {

        window.location.reload();

    }, 500);

}


// ==========================================
// MENSAGEM GLOBAL
// ==========================================

function showAppMessage(message) {

    let notification =
        document.querySelector(
            ".app-notification"
        );

    if (!notification) {

        notification =
            document.createElement("div");

        notification.className =
            "app-notification";

        document.body.appendChild(
            notification
        );

        notification.style.position =
            "fixed";

        notification.style.right =
            "25px";

        notification.style.bottom =
            "25px";

        notification.style.padding =
            "14px 18px";

        notification.style.background =
            "#11161e";

        notification.style.border =
            "1px solid #242b36";

        notification.style.borderRadius =
            "10px";

        notification.style.color =
            "#f5f7fa";

        notification.style.fontSize =
            "13px";

        notification.style.fontWeight =
            "700";

        notification.style.zIndex =
            "9999";

        notification.style.opacity =
            "0";

        notification.style.transform =
            "translateY(15px)";

        notification.style.transition =
            "0.25s";

    }

    notification.textContent =
        message;

    requestAnimationFrame(() => {

        notification.style.opacity =
            "1";

        notification.style.transform =
            "translateY(0)";

    });

    setTimeout(() => {

        notification.style.opacity =
            "0";

        notification.style.transform =
            "translateY(15px)";

    }, 2500);

}


// ==========================================
// UTILITÁRIOS
// ==========================================

function formatPoints(value) {

    return Number(value)
        .toLocaleString("pt-BR");

}


function getCurrentPlayer() {

    return loadPlayer();

}


// ==========================================
// INICIAR APLICAÇÃO
// ==========================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}