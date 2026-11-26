
const money = document.getElementById("money");
const stars = document.getElementById("stars");
const speed = document.getElementById("speed");
const vip = document.getElementById("vip");
const world = document.getElementById("world");

const resetButton = document.getElementById("resetButton");

// Traduções
const translations = {
    pt: {
        subtitle: "Calcule por quanto tempo seu dinheiro será suficiente para roletar.",
        moneyLabel: "💸 Dinheiro disponível",
        moneyPlaceholder: "Ex: 100K, 10M, 1B",
        starsLabel: "⭐ Estrelas por abertura",
        speedLabel: "⚡ Velocidade",
        vipLabel: "👑 Gamepass VIP",
        worldLabel: "🌎 Mundo / Custo por estrela",
        resultTitle: "⏳ RESULTADO DO CÁLCULO",
        spinsLabel: "🎰 Total de aberturas",
        totalStarsLabel: "🌟 Total de estrelas",
        costLabel: "💰 Dinheiro utilizado",
        remainingLabel: "🪙 Dinheiro restante",
        resetButton: "🔄 Restaurar configurações",
        footer: "Gacha Time Calculator • Cálculo automático",
        normal: "Normal",
        fast: "Fast Open",
        bonus: "25%",
        fastBonus: "Fast Open + 25%",
        disabled: "Desativado",
        enabled: "Ativado (25% de desconto)",
        worlds: ["Mundo 1", "Mundo 2", "Mundo 3", "Mundo 4", "Mundo 5", "Mundo 6", "Mundo 7"],
        locale: "pt-BR"
    },

    en: {
        subtitle: "Calculate how long your money will last while rolling.",
        moneyLabel: "💸 Available Money",
        moneyPlaceholder: "Ex: 100K, 10M, 1B",
        starsLabel: "⭐ Stars per Opening",
        speedLabel: "⚡ Speed",
        vipLabel: "👑 VIP Gamepass",
        worldLabel: "🌎 World / Cost per Star",
        resultTitle: "⏳ CALCULATION RESULTS",
        spinsLabel: "🎰 Total Openings",
        totalStarsLabel: "🌟 Total Stars",
        costLabel: "💰 Money Spent",
        remainingLabel: "🪙 Remaining Money",
        resetButton: "🔄 Reset Settings",
        footer: "Gacha Time Calculator • Automatic calculation",
        normal: "Normal",
        fast: "Fast Open",
        bonus: "25%",
        fastBonus: "Fast Open + 25%",
        disabled: "Disabled",
        enabled: "Enabled (25% discount)",
        worlds: ["World 1", "World 2", "World 3", "World 4", "World 5", "World 6", "World 7"],
        locale: "en-US"
    },

    es: {
        subtitle: "Calcula cuánto tiempo durará tu dinero al hacer tiradas.",
        moneyLabel: "💸 Dinero disponible",
        moneyPlaceholder: "Ej: 100K, 10M, 1B",
        starsLabel: "⭐ Estrellas por apertura",
        speedLabel: "⚡ Velocidad",
        vipLabel: "👑 Gamepass VIP",
        worldLabel: "🌎 Mundo / Costo por estrella",
        resultTitle: "⏳ RESULTADO DEL CÁLCULO",
        spinsLabel: "🎰 Total de aperturas",
        totalStarsLabel: "🌟 Total de estrellas",
        costLabel: "💰 Dinero utilizado",
        remainingLabel: "🪙 Dinero restante",
        resetButton: "🔄 Restaurar configuración",
        footer: "Gacha Time Calculator • Cálculo automático",
        normal: "Normal",
        fast: "Apertura rápida",
        bonus: "25%",
        fastBonus: "Apertura rápida + 25%",
        disabled: "Desactivado",
        enabled: "Activado (25% de descuento)",
        worlds: ["Mundo 1", "Mundo 2", "Mundo 3", "Mundo 4", "Mundo 5", "Mundo 6", "Mundo 7"],
        locale: "es-ES"
    }
};

let currentLanguage = localStorage.getItem("gachaLanguage") || "pt";

if (!translations[currentLanguage]) {
    currentLanguage = "pt";
}

// Formatação de números
function format(value) {
    return Math.floor(value).toLocaleString(
        translations[currentLanguage].locale
    );
}

// Converte K, M e B em valores numéricos
function parseMoney(value) {
    const normalized = value.trim().toUpperCase().replace(",", ".");
    const match = normalized.match(/^(\d+(?:\.\d+)?)\s*([KMB])?$/);

    if (!match) return NaN;

    const number = Number(match[1]);
    const suffix = match[2];

    const multipliers = {
        K: 1_000,
        M: 1_000_000,
        B: 1_000_000_000
    };

    return number * (multipliers[suffix] || 1);
}

// Converte valores numéricos para K, M e B
function abbreviateMoney(value) {
    if (!Number.isFinite(value)) return value;

    const abs = Math.abs(value);

    if (abs >= 1_000_000_000) {
        return (value / 1_000_000_000)
            .toString()
            .replace(".", ",") + "B";
    }

    if (abs >= 1_000_000) {
        return (value / 1_000_000)
            .toString()
            .replace(".", ",") + "M";
    }

    if (abs >= 1_000) {
        return (value / 1_000)
            .toString()
            .replace(".", ",") + "K";
    }

    return value.toString();
}

// Formata o dinheiro ao sair do campo
function formatMoneyInput(input) {
    const value = parseMoney(input.value);

    if (Number.isFinite(value) && value >= 0) {
        input.value = abbreviateMoney(value);
    }
}

// Traduz a interface
function translatePage(language) {
    const t = translations[language];

    if (!t) return;

    currentLanguage = language;
    localStorage.setItem("gachaLanguage", language);

    document.documentElement.lang = t.locale;

    // Textos da interface
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        if (t[key]) {
            element.textContent = t[key];
        }
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.dataset.i18nPlaceholder;

        if (t[key]) {
            element.placeholder = t[key];
        }
    });

    // Velocidades
    speed.options[0].textContent = `${t.normal} (1x)`;
    speed.options[1].textContent = `${t.fast} (2x)`;
    speed.options[2].textContent = `${t.bonus} (1.25x)`;
    speed.options[3].textContent = `${t.fastBonus} (2.5x)`;

    // VIP
    vip.options[0].textContent = t.disabled;
    vip.options[1].textContent = t.enabled;

    // Mundos
    const prices = [
        "80",
        "300",
        "2.5K",
        "12.5K",
        "50K",
        "200K",
        "1.150M"
    ];

    Array.from(world.options).forEach((option, index) => {
        option.textContent = `${t.worlds[index]} — ${prices[index]}`;
    });

    // Botões de idioma
    document.querySelectorAll(".language-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.lang === language
        );
    });

    calculate();
}

// Cálculo principal
function calculate() {
    const availableMoney = parseMoney(money.value);
    const starsPerOpening = Number(stars.value);
    const speedMultiplier = Number(speed.value);
    const vipActive = Number(vip.value);
    const costPerStar = Number(world.value);

    const elements = [
        "time",
        "spins",
        "totalStars",
        "spinCost",
        "remaining"
    ];

    // Validação
    if (
        money.value.trim() === "" ||
        stars.value.trim() === "" ||
        !Number.isFinite(availableMoney) ||
        !Number.isFinite(starsPerOpening) ||
        !Number.isInteger(starsPerOpening) ||
        !Number.isFinite(speedMultiplier) ||
        !Number.isFinite(vipActive) ||
        !Number.isFinite(costPerStar) ||
        availableMoney < 0 ||
        starsPerOpening <= 0 ||
        speedMultiplier <= 0 ||
        (vipActive !== 0 && vipActive !== 1) ||
        costPerStar <= 0
    ) {
        elements.forEach(id => {
            document.getElementById(id).textContent = "--";
        });

        return;
    }

    // Tempo de cada abertura
    const baseOpeningTime = 5.15;
    const effectiveOpeningTime = baseOpeningTime / speedMultiplier;

    // Desconto VIP de 25%
    const discountMultiplier = vipActive === 1 ? 0.75 : 1;
    const discountedCostPerStar = costPerStar * discountMultiplier;

    // Custo de cada abertura
    const costPerOpening = starsPerOpening * discountedCostPerStar;

    // Quantidade de aberturas possíveis com o dinheiro disponível
    const totalOpenings = Math.floor(
        availableMoney / costPerOpening
    );

    // Tempo total que o dinheiro permite roletar
    const totalTime = totalOpenings * effectiveOpeningTime;

    // Conversão do tempo
    const displayHours = Math.floor(totalTime / 3600);
    const displayMinutes = Math.floor((totalTime % 3600) / 60);
    const displaySeconds = Math.floor(totalTime % 60);

    // Total de estrelas
    const totalStars = totalOpenings * starsPerOpening;

    // Dinheiro utilizado
    const totalCost = totalOpenings * costPerOpening;

    // Dinheiro restante
    const remainingMoney = availableMoney - totalCost;

    // Resultado principal
    document.getElementById("time").textContent =
        `${format(displayHours)}h ${String(displayMinutes).padStart(2, "0")}min ${String(displaySeconds).padStart(2, "0")}s`;

    // Estatísticas
    document.getElementById("spins").textContent =
        format(totalOpenings);

    document.getElementById("totalStars").textContent =
        format(totalStars);

    document.getElementById("spinCost").textContent =
        format(totalCost);

    document.getElementById("remaining").textContent =
        format(remainingMoney);
}

// Eventos dos botões de idioma
document.querySelectorAll(".language-btn").forEach(button => {
    button.addEventListener("click", () => {
        translatePage(button.dataset.lang);
    });
});

// Formatação automática do dinheiro
money.addEventListener("blur", () => {
    formatMoneyInput(money);
    calculate();
});

// Atualização automática dos cálculos
[money, stars, speed, vip, world].forEach(input => {
    input.addEventListener("input", calculate);
    input.addEventListener("change", calculate);
});

// Restaurar configurações padrão
function resetCalculator() {
    money.value = "0";
    stars.value = "1";
    speed.value = "1";
    vip.value = "0";
    world.value = "80";

    calculate();
}

resetButton.addEventListener("click", resetCalculator);

// Inicialização
translatePage(currentLanguage);
