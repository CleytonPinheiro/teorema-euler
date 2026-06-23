/**
 * history.js — histórico de cálculos da sessão
 * Armazena até 8 entradas no sessionStorage.
 */

const STORAGE_KEY = "calc_historico";
const MAX_ENTRIES = 8;

/** Retorna o histórico salvo (mais recente primeiro) */
export function getHistorico() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Salva um novo cálculo no histórico */
export function salvarNoHistorico({ a, b, n, result, canUseEuler }) {
  const historico = getHistorico();
  historico.unshift({ a, b, n, result, canUseEuler, ts: Date.now() });
  if (historico.length > MAX_ENTRIES) historico.length = MAX_ENTRIES;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(historico));
}

/** Renderiza o histórico na tela */
export function renderHistorico(onClickEntry) {
  const container = document.getElementById("historico");
  const historico = getHistorico();

  if (historico.length === 0) {
    container.hidden = true;
    return;
  }

  const itens = historico
    .map(
      (e, i) => `
      <li class="hist-item" data-index="${i}" title="Clique para reusar">
        <span class="hist-expr">${e.a}<sup>${e.b}</sup> mod ${e.n}</span>
        <span class="hist-equals">= ${e.result}</span>
        <span class="hist-badge ${e.canUseEuler ? "badge-success" : "badge-neutral"}">
          ${e.canUseEuler ? "Euler" : "Rápida"}
        </span>
      </li>`
    )
    .join("");

  container.innerHTML = `
    <div class="hist-header">
      <span class="hist-title">Histórico da sessão</span>
      <button id="btn-limpar-hist" class="hist-clear-btn" title="Limpar histórico">✕ Limpar</button>
    </div>
    <ol class="hist-list">${itens}</ol>
  `;
  container.hidden = false;

  container.querySelectorAll(".hist-item").forEach((el) => {
    el.addEventListener("click", () => {
      const entry = historico[parseInt(el.dataset.index, 10)];
      onClickEntry(entry);
    });
  });

  document.getElementById("btn-limpar-hist").addEventListener("click", (e) => {
    e.stopPropagation();
    sessionStorage.removeItem(STORAGE_KEY);
    container.hidden = true;
  });
}
