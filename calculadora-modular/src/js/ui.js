/**
 * ui.js — manipulação do DOM
 * Calculadora de Potências Modulares · Helen Daiane / ProfMat UEM 2026
 */

import { eulerModPower } from "./math.js";
import { salvarNoHistorico, renderHistorico } from "./history.js";

/* ── Referências ao modal ──────────────────────────────────────── */
const modal     = () => document.getElementById("modal");
const modalBody = () => document.getElementById("modal-body");

/** Abre o modal com conteúdo HTML */
function abrirModal(html) {
  modalBody().innerHTML = html;
  modal().hidden = false;
  document.body.classList.add("modal-open");
  modal().querySelector(".modal-close")?.focus();
}

/** Fecha o modal */
function fecharModal() {
  modal().hidden = true;
  document.body.classList.remove("modal-open");
}

/** Monta o HTML do resultado para o modal */
function buildResultHTML(a, b, n, res) {
  const badgeHTML = res.canUseEuler
    ? `<span class="badge badge-success">Teorema de Euler aplicado</span>`
    : `<span class="badge badge-neutral">Exponenciação modular rápida</span>`;

  const stepsHTML = res.steps
    .map(s => `<li class="step-item">${s}</li>`)
    .join("");

  return `
    <div class="modal-result-header">
      <div class="modal-expr">
        ${a}<sup>${b}</sup> mod ${n}
      </div>
      <div class="modal-result-value">${res.result}</div>
      <div class="modal-badge">${badgeHTML}</div>
    </div>
    <div class="modal-steps">
      <p class="steps-title">Passo a passo</p>
      <ol class="steps-list">${stepsHTML}</ol>
    </div>
  `;
}

/** Mostra erro inline (abaixo do botão) */
function showError(msg) {
  const el = document.getElementById("inline-error");
  el.textContent = msg;
  el.hidden = false;
}

function clearError() {
  const el = document.getElementById("inline-error");
  el.textContent = "";
  el.hidden = true;
}

/** Preenche os campos com uma entrada do histórico */
function preencherCampos({ a, b, n }) {
  document.getElementById("base").value = a;
  document.getElementById("exp").value = b;
  document.getElementById("mod").value = n;
  document.getElementById("base").focus();
}

/** Lê os campos, valida e chama o cálculo */
export function calcular() {
  const a = parseInt(document.getElementById("base").value, 10);
  const b = parseInt(document.getElementById("exp").value, 10);
  const n = parseInt(document.getElementById("mod").value, 10);

  clearError();

  if (isNaN(a) || isNaN(b) || isNaN(n)) {
    showError("Preencha todos os campos corretamente.");
    return;
  }

  const res = eulerModPower(a, b, n);

  if ("error" in res) {
    showError(res.error);
    return;
  }

  abrirModal(buildResultHTML(a, b, n, res));

  salvarNoHistorico({ a, b, n, result: res.result, canUseEuler: res.canUseEuler });
  renderHistorico(preencherCampos);
}

/* ── Toggle do sidebar ─────────────────────────────────────────── */
function inicializarToggleSidebar() {
  const btn     = document.getElementById("btn-toggle-sidebar");
  const content = document.querySelector(".page-content");

  function aplicarEstado(oculto) {
    content.classList.toggle("sidebar-hidden", oculto);
    btn.setAttribute("aria-pressed", String(oculto));
    btn.setAttribute("aria-label", oculto ? "Exibir painel de teoria" : "Ocultar painel de teoria");
    btn.classList.toggle("is-active", oculto);
  }

  const salvo = sessionStorage.getItem("sidebar-hidden") === "1";
  aplicarEstado(salvo);

  btn.addEventListener("click", () => {
    const agora = !content.classList.contains("sidebar-hidden");
    aplicarEstado(agora);
    sessionStorage.setItem("sidebar-hidden", agora ? "1" : "0");
  });
}

/** Inicializa os listeners de eventos */
export function inicializar() {
  document.getElementById("btn-calcular").addEventListener("click", calcular);

  document.querySelectorAll(".field-input").forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") calcular();
    });
  });

  /* Fechar modal */
  document.getElementById("modal").addEventListener("click", e => {
    if (e.target === e.currentTarget) fecharModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") fecharModal();
  });

  document.addEventListener("click", e => {
    if (e.target.closest(".modal-close")) fecharModal();
  });

  inicializarToggleSidebar();

  renderHistorico(preencherCampos);
}
