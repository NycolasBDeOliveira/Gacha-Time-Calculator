
const money = document.getElementById("money");
const stars = document.getElementById("stars");
const seconds = document.getElementById("seconds");
const cost = document.getElementById("cost");

const resetButton = document.getElementById("resetButton");

const format = value =>
    Math.floor(value).toLocaleString("pt-BR");

function calculate() {

    const availableMoney = Number(money.value);
    const starsPerSpin = Number(stars.value);
    const timePerSpin = Number(seconds.value);
    const costPerStar = Number(cost.value);

    // Validar valores
    if (
        money.value.trim() === "" ||
        stars.value.trim() === "" ||
        seconds.value.trim() === "" ||
        cost.value.trim() === "" ||
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

    // Custo total de cada giro
    const costPerSpin = starsPerSpin * costPerStar;

    // Quantidade máxima de giros
    const totalSpins = Math.floor(
        availableMoney / costPerSpin
    );

    // Total de estrelas obtidas
    const totalStars = totalSpins * starsPerSpin;

    // Dinheiro restante
    const remainingMoney =
        availableMoney - (totalSpins * costPerSpin);

    // Tempo total em segundos
    const totalTime = totalSpins * timePerSpin;

    // Conversão para horas, minutos e segundos
    const hours = Math.floor(totalTime / 3600);

    const minutes = Math.floor(
        (totalTime % 3600) / 60
    );

    const secs = Math.floor(totalTime % 60);

    // Atualizar interface
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

// Atualização automática dos cálculos
[money, stars, seconds, cost].forEach(input => {
    input.addEventListener("input", calculate);
});

// Restaurar configurações padrão
function resetCalculator() {

    money.value = 100000000;
    stars.value = 2;
    seconds.value = 5.5;
    cost.value = 200000;

    calculate();
}

resetButton.addEventListener("click", resetCalculator);

// Executar ao abrir a página
calculate();
