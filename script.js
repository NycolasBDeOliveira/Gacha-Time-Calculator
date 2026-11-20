
const money = document.getElementById("money");
const stars = document.getElementById("stars");
const seconds = document.getElementById("seconds");
const world = document.getElementById("world");

const resetButton = document.getElementById("resetButton");
const fastButton = document.getElementById("fastButton");
const normalButton = document.getElementById("normalButton");

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

// Formata o campo ao sair dele
function formatMoneyInput(input) {
    const value = parseMoney(input.value);

    if (Number.isFinite(value) && value >= 0) {
        input.value = abbreviateMoney(value);
    }
}

// Função principal de cálculo
function calculate() {
    const availableMoney = parseMoney(money.value);
    const starsPerSpin = Number(stars.value);
    const timePerSpin = Number(seconds.value);
    const costPerStar = Number(world.value);

    if (
        money.value.trim() === "" ||
        stars.value.trim() === "" ||
        seconds.value.trim() === "" ||
        !Number.isFinite(availableMoney) ||
        !Number.isFinite(starsPerSpin) ||
        !Number.isFinite(timePerSpin) ||
        !Number.isFinite(costPerStar) ||
        availableMoney < 0 ||
        starsPerSpin <= 0 ||
        timePerSpin <= 0 ||
        costPerStar <= 0
    ) {
        document.getElementById("time").textContent = "--";
        document.getElementById("spins").textContent = "--";
        document.getElementById("totalStars").textContent = "--";
        document.getElementById("spinCost").textContent = "--";
        document.getElementById("remaining").textContent = "--";
        return;
    }

    const costPerSpin = starsPerSpin * costPerStar;

    const totalSpins = Math.floor(
        availableMoney / costPerSpin
    );

    const totalStars = totalSpins * starsPerSpin;

    const remainingMoney =
        availableMoney - (totalSpins * costPerSpin);

    const totalTime = totalSpins * timePerSpin;

    // Conversão do tempo
    const hours = Math.floor(totalTime / 3600);

    const minutes = Math.floor(
        (totalTime % 3600) / 60
    );

    const secs = Math.floor(totalTime % 60);

    // Atualização dos resultados
    document.getElementById("time").textContent =
        `${format(hours)}h ${format(minutes)}min ${format(secs)}s`;

    document.getElementById("spins").textContent =
        format(totalSpins);

    document.getElementById("totalStars").textContent =
        format(totalStars);

    document.getElementById("spinCost").textContent =
        format(costPerSpin);

    document.getElementById("remaining").textContent =
        format(remainingMoney);
}

// Conversão automática do dinheiro disponível
money.addEventListener("blur", () => {
    formatMoneyInput(money);
    calculate();
});

// Fast Open: 3 segundos
fastButton.addEventListener("click", () => {
    seconds.value = 3;
    calculate();
});

// Normal: 5,5 segundos
normalButton.addEventListener("click", () => {
    seconds.value = 5.5;
    calculate();
});

// Atualização automática dos cálculos
[money, stars, seconds, world].forEach(input => {
    input.addEventListener("input", calculate);
    input.addEventListener("change", calculate);
});

// Restaurar configurações padrão
function resetCalculator() {
    money.value = "0";
    stars.value = 1;
    seconds.value = 5.5;
    world.value = "80";

    calculate();
}

resetButton.addEventListener("click", resetCalculator);

// Cálculo inicial
calculate();
