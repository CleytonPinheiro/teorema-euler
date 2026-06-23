/**
 * ui.js — manipulação do DOM
 * Calculadora de Potências Modulares · Helen Daiane / ProfMat UEM 2026
 */

import { eulerModPower } from "./math.js";

/** Mostra mensagem de erro no painel de resultado */
function showError(output, msg) {
  output.className = "result-card error";
  output.textContent = msg;
  output.hidden = false;
}

/** Monta e exibe o painel de resultado com passo a passo */
function showResult(output, res) {
  const badgeHTML = res.canUseEuler
    ? `<span class="badge badge-success">Teorema de Euler aplicado</span>`
    : `<span class="badge badge-neutral">Exponenciação modular rápida</span>`;

  const stepsHTML = res.steps
    .map(s => `<li class="step-item">${s}</li>`)
    .join("");

  output.className = "result-card";
  output.innerHTML = `
    <div class="result-header">
      <span class="result-label">Resultado</span>
      <span class="result-value">${res.result}</span>
    </div>
    <div class="euler-badge">${badgeHTML}</div>
    <div class="steps-box">
      <p class="steps-title">Passo a passo</p>
      <ol class="steps-list">${stepsHTML}</ol>
    </div>
  `;
  output.hidden = false;
}

/** Lê os campos, valida e chama o cálculo */
export function calcular() {
  const a = parseInt(document.getElementById("base").value, 10);
  const b = parseInt(document.getElementById("exp").value, 10);
  const n = parseInt(document.getElementById("mod").value, 10);
  const output = document.getElementById("output");

  if (isNaN(a) || isNaN(b) || isNaN(n)) {
    showError(output, "Preencha todos os campos corretamente.");
    return;
  }

  const res = eulerModPower(a, b, n);

  if ("error" in res) {
    showError(output, res.error);
    return;
  }

  showResult(output, res);
}

/** Inicializa os listeners de eventos */
export function inicializar() {
  document.getElementById("btn-calcular").addEventListener("click", calcular);

  document.querySelectorAll(".field-input").forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") calcular();
    });
  });
}
