
const money = document.getElementById("money");
const stars = document.getElementById("stars");
const speed = document.getElementById("speed");
const world = document.getElementById("world");

const resetButton = document.getElementById("resetButton");

// Formatação de números
const format = value =>
    Math.floor(value).toLocaleString("pt-BR");

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

// Função principal de cálculo
function calculate() {
    const availableMoney = parseMoney(money.value);
    const starsPerOpening = Number(stars.value);
    const speedMultiplier = Number(speed.value);
    const costPerStar = Number(world.value);

    // Validação dos campos
    if (
        money.value.trim() === "" ||
        stars.value.trim() === "" ||
        !Number.isFinite(availableMoney) ||
        !Number.isFinite(starsPerOpening) ||
        !Number.isFinite(speedMultiplier) ||
        !Number.isFinite(costPerStar) ||
        availableMoney < 0 ||
        starsPerOpening <= 0 ||
        speedMultiplier <= 0 ||
        costPerStar <= 0
    ) {
        document.getElementById("time").textContent = "--";
        document.getElementById("spins").textContent = "--";
        document.getElementById("totalStars").textContent = "--";
        document.getElementById("spinCost").textContent = "--";
        document.getElementById("remaining").textContent = "--";
        return;
    }

    // Tempo de abertura com bônus de velocidade
    const baseOpeningTime = 5.15;
    const effectiveOpeningTime = baseOpeningTime / speedMultiplier;

    // Custo de cada abertura
    const costPerOpening = starsPerOpening * costPerStar;

    // Quantidade de aberturas possíveis
    const totalOpenings = Math.floor(
        availableMoney / costPerOpening
    );

    // Tempo total de funcionamento
    const totalTime = totalOpenings * effectiveOpeningTime;

    // Conversão para horas, minutos e segundos
    const displayHours = Math.floor(totalTime / 3600);
    const displayMinutes = Math.floor((totalTime % 3600) / 60);
    const displaySeconds = Math.floor(totalTime % 60);

    // Total de estrelas
    const totalStars = totalOpenings * starsPerOpening;

    // Gasto total
    const totalCost = totalOpenings * costPerOpening;

    // Dinheiro restante
    const remainingMoney = availableMoney - totalCost;

    // Resultado principal
    document.getElementById("time").textContent =
        `${format(displayHours)}h ${format(displayMinutes)}min ${format(displaySeconds)}s`;

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

// Conversão automática do dinheiro disponível
money.addEventListener("blur", () => {
    formatMoneyInput(money);
    calculate();
});

// Atualização automática dos cálculos
[money, stars, speed, world].forEach(input => {
    input.addEventListener("input", calculate);
    input.addEventListener("change", calculate);
});

// Restaurar configurações padrão
function resetCalculator() {
    money.value = "0";
    stars.value = 1;
    speed.value = "1";
    world.value = "80";

    calculate();
}

resetButton.addEventListener("click", resetCalculator);

// Cálculo inicial
calculate();
