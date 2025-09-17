function numericalIntegration(f, a, b, n = 1000) {
    const dx = (b - a) / n;
    let sum = 0;

    for (let i = 0; i < n; i++) {
        const x = a + i * dx;
        sum += f(x);
    }

    return sum * dx;
}

function calculateIntegral() {
    const aStr = prompt("Введите левую границу интегрирования (a):");
    const bStr = prompt("Введите правую границу интегрирования (b):");

    if (aStr === null || bStr === null) {
        alert("Ввод отменен.");
        return;
    }

    const a = parseFloat(aStr);
    const b = parseFloat(bStr);

    if (isNaN(a) || isNaN(b)) {
        alert("Пожалуйста, введите корректные числа.");
        return;
    }

    if (a >= b) {
        alert("Левая граница должна быть меньше правой.");
        return;
    }

    const nStr = prompt("Введите количество подинтервалов (по умолчанию 1000):", "1000");
    const n = nStr ? parseInt(nStr) : 1000;

    if (isNaN(n) || n <= 0) {
        alert("Количество подинтервалов должно быть положительным целым числом.");
        return;
    }

    const result = numericalIntegration(f, a, b, n);

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <h3>Результат:</h3>
        <p>Интеграл от ${a} до ${b} функции f(x) = x² - cos(x)</p>
        <p>Количество подинтервалов: ${n}</p>
        <p><strong>Значение интеграла ≈ ${result.toFixed(6)}</strong></p>
    `;

    // Также выводим в консоль для отладки
    console.log(`Интеграл от ${a} до ${b} с n=${n}:`, result);
}

function f(x) {
    return x * x - Math.cos(x);
}