/**
 * ui.js — manipulação do DOM
 * Calculadora de Potências Modulares · Helen Daiane / ProfMat UEM 2026
 */

import { eulerModPower } from "./math.js";
import { salvarNoHistorico, renderHistorico } from "./history.js";

/* ── Referências ao modal ──────────────────────────────────────── */
const modal     = () => document.getElementById("modal");
const modalBody = () => document.getElementById("modal-body");

/** Fecha o modal */
function fecharModal() {
  modal().classList.remove("is-open");
  document.body.classList.remove("modal-open");
}

/** Abre o modal com um nó de conteúdo */
function abrirModal(node) {
  const body = modalBody();
  while (body.firstChild) body.removeChild(body.firstChild);
  body.appendChild(node);
  modal().classList.add("is-open");
  document.body.classList.add("modal-open");
  modal().querySelector(".modal-close")?.focus();
}

/** Cria um elemento simples com classe e conteúdo opcional */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Monta o conteúdo do resultado usando DOM (sem innerHTML) */
function buildResultContent(a, b, n, res) {
  const frag = document.createDocumentFragment();

  /* ── Cabeçalho: expressão + número grande + badge ── */
  const header = el("div", "modal-result-header");

  const expr = el("div", "modal-expr");
  expr.appendChild(document.createTextNode(String(a)));
  const sup = document.createElement("sup");
  sup.textContent = String(b);
  expr.appendChild(sup);
  expr.appendChild(document.createTextNode(" mod " + n));
  header.appendChild(expr);

  header.appendChild(el("div", "modal-result-value", String(res.result)));

  const badge = el("div", "modal-badge");
  const badgeSpan = el(
    "span",
    res.canUseEuler ? "badge badge-success" : "badge badge-neutral",
    res.canUseEuler ? "Teorema de Euler aplicado" : "Exponenciação modular rápida"
  );
  badge.appendChild(badgeSpan);
  header.appendChild(badge);

  frag.appendChild(header);

  /* ── Passos ── */
  const stepsBox = el("div", "modal-steps");
  stepsBox.appendChild(el("p", "steps-title", "Passo a passo"));
  const ol = el("ol", "steps-list");
  res.steps.forEach(s => ol.appendChild(el("li", "step-item", s)));
  stepsBox.appendChild(ol);

  frag.appendChild(stepsBox);

  return frag;
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

  abrirModal(buildResultContent(a, b, n, res));

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
