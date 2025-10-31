const API_URL = "https://economia.awesomeapi.com.br/json/last/USD-BRL";

// Seletores de elementos
const $btn = document.getElementById("fetchBtn");
const $status = document.getElementById("status");
const $current = document.getElementById("currentValue");
const $high = document.getElementById("highValue");
const $low = document.getElementById("lowValue");
const $updated = document.getElementById("updatedAt");

const fmtBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatDateTime(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

async function fetchDolar() {
  try {
    $btn.disabled = true;
    $status.textContent = "Carregando cotação...";
    $status.style.color = ""; // padrão

    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    const data = json && json.USDBRL;
    if (!data) {
      throw new Error("Resposta inesperada da API.");
    }

    const bid = Number(data.bid); // valor atual
    const high = Number(data.high); // máxima do dia
    const low = Number(data.low); // mínima do dia

    $current.textContent = isFinite(bid) ? fmtBRL.format(bid) : "—";
    $high.textContent = isFinite(high) ? fmtBRL.format(high) : "—";
    $low.textContent = isFinite(low) ? fmtBRL.format(low) : "—";

    const when = data.create_date
      ? new Date(data.create_date.replace(" ", "T"))
      : new Date();

    $updated.textContent = `Atualizado em: ${formatDateTime(when)}`;
    $status.textContent = "Pronto.";
  } catch (err) {
    console.error(err);
    $status.textContent =
      "Não foi possível obter os dados agora. Tente novamente.";
    $status.style.color = "#b91c1c";
  } finally {
    $btn.disabled = false;
  }
}

// Carrega automaticamente uma vez ao abrir a página
document.addEventListener("DOMContentLoaded", fetchDolar);

// permite atualizar manualmente no botão
$btn.addEventListener("click", fetchDolar);
