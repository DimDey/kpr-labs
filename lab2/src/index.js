import { MiniMaple } from './miniMaple.js';

document.addEventListener('DOMContentLoaded', () => {
    const expressionInput = document.getElementById('expression');
    const variableInput = document.getElementById('variable');
    const diffButton = document.getElementById('diffButton');
    const resultDiv = document.getElementById('result');

    diffButton.addEventListener('click', () => {
        const expression = expressionInput.value.trim();
        const variable = variableInput.value.trim();

        if (!expression || !variable) {
            resultDiv.textContent = 'Please enter both expression and variable.';
            resultDiv.style.color = 'red';
            return;
        }

        try {
            const result = MiniMaple.diff(expression, variable);
            resultDiv.textContent = result;
            resultDiv.style.color = '#27ae60';
        } catch (error) {
            resultDiv.textContent = `Error: ${error.message}`;
            resultDiv.style.color = 'red';
        }
    });
});