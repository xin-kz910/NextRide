import { fakePlans } from "./fake_plans.js";
import { evaluatePlan } from "./risk_rules.js";

function badgeText(color) {
  if (color === "green") return "低風險";
  if (color === "yellow") return "中風險";
  return "高風險";
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function segField(seg, keys, fallback = "") {
  for (const k of keys) {
    const v = seg?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
}

function setStatus(text) {
  const el = document.getElementById("status");
  if (!el) return;
  el.textContent = text || "";
}

async function getPlans() {
  return fakePlans?.plans || [];
}

function renderPlanCard(plan, idx, buffer) {
  const segments = plan?.segments || [];
  const ev = evaluatePlan(plan, buffer);

  const waits = ev.waits || [];
  const color = ev.risk_color || "green";
  const totalMin = ev.total_minutes ?? 0;

  const planId = plan?.plan_id
    ? ` <span class="muted">(${escapeHtml(plan.plan_id)})</span>`
    : "";

  const reasonLine =
    ev.reason && color !== "green"
      ? `<div class="muted" style="margin-top:6px;">⚠️ ${escapeHtml(
          ev.reason
        )}</div>`
      : "";

  const waitLines =
    waits.length === 0
      ? `<div class="muted">直達：無需轉乘</div>`
      : waits
          .map(
            (w, i) =>
              `<div class="muted">轉乘 ${i + 1} 等待：${escapeHtml(
                w.minutes
              )} 分鐘</div>`
          )
          .join("");

  const segHtml = segments
    .map((s) => {
      const mode = segField(s, ["mode"], "");
      const from = segField(s, ["from_stop_id", "from"], "");
      const to = segField(s, ["to_stop_id", "to"], "");
      const depart = segField(s, ["depart_time", "depart"], "");
      const arrive = segField(s, ["arrive_time", "arrive"], "");

      return `
        <div class="seg">
          <div><b>${escapeHtml(mode)}</b>：${escapeHtml(from)} → ${escapeHtml(
        to
      )}</div>
          <div class="muted">${escapeHtml(depart)} → ${escapeHtml(
        arrive
      )}</div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <b>方案 ${idx + 1}</b>${planId}
          <span class="muted">・${segments.length} 段・總耗時 ${escapeHtml(
    totalMin
  )} 分</span>
        </div>
        <span class="badge ${escapeHtml(color)}">${badgeText(color)}</span>
      </div>
      ${reasonLine}
      ${waitLines}
      ${segHtml}
    </div>
  `;
}

async function renderAll() {
  const app = document.getElementById("app");
  const bufferInput = document.getElementById("buffer");

  const raw = bufferInput?.value ?? "";
  const buffer = Number(raw);


  if (!Number.isFinite(buffer)) {
    app.innerHTML = `
      <div class="card">
        <b>輸入不正確</b><br/>
        buffer 請輸入 0～60 的整數。
      </div>
    `;
    return;
  }

  if (!Number.isInteger(buffer)) {
    app.innerHTML = `
      <div class="card">
        <b>輸入不正確</b><br/>
        buffer 必須是整數（例如 0、5、10）。
      </div>
    `;
    return;
  }

  if (buffer < 0 || buffer > 60) {
    app.innerHTML = `
      <div class="card">
        <b>buffer 超出範圍</b><br/>
        目前輸入：${escapeHtml(buffer)}，請輸入 0～60。
      </div>
    `;
    return;
  }


  setStatus("查詢中…");
  app.innerHTML = `
    <div class="card">
      <b>查詢中…</b><br/>
      正在計算方案，請稍等。
    </div>
  `;

  try {
    await new Promise((r) => setTimeout(r, 200)); // demo 用延遲

    const plans = await getPlans();

    if (!plans || plans.length === 0) {
      setStatus("沒有結果");
      app.innerHTML = `
        <div class="card">
          <b>沒有結果</b><br/>
          沒有找到符合的班次。
        </div>
      `;
      return;
    }

    app.innerHTML = plans.map((p, i) => renderPlanCard(p, i, buffer)).join("");
    setStatus(`完成：${plans.length} 組方案`);
  } catch (err) {
    const msg = escapeHtml(String(err?.message || err));
    setStatus("發生錯誤");
    app.innerHTML = `
      <div class="card" style="border-color:#f5c2c7; background:#f8d7da; color:#842029;">
        <b>發生錯誤</b><br/>
        查詢失敗：${msg}
      </div>
    `;
  }
}

document.getElementById("btnRender")?.addEventListener("click", renderAll);
renderAll();
