// 這支檔案負責「查詢頁的行為」
// 現在這一版：只做一件事 → 抓表單輸入並印出來

// stop_id -> stop name 對照表
const stopMap = {};

// 頁面載入後：先把 stops 讀進來，塞入下拉選單
initStops();

async function initStops() {
  try {
    const res = await fetch("/stops");
    const data = await res.json();

    const stops = Array.isArray(data?.stops) ? data.stops : [];

    const fromSelect = document.getElementById("fromStop");
    const toSelect = document.getElementById("toStop");

    // 清空原本的「載入中」
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    // 建立 option
    stops.forEach((s) => {
      // 建立對照表
      stopMap[s.stop_id] = s.name;
        
      const label = `${s.stop_id}（${s.name}）`;

      const opt1 = document.createElement("option");
      opt1.value = s.stop_id;
      opt1.textContent = label;

      const opt2 = document.createElement("option");
      opt2.value = s.stop_id;
      opt2.textContent = label;

      fromSelect.appendChild(opt1);
      toSelect.appendChild(opt2);
    });

    // ✅ 幫你預設選一些常用（可改、也可刪）
    fromSelect.value = "BUS_NCNU";
    toSelect.value = "BUS_TAICHUNG_TRA";
  } catch (err) {
    console.error("initStops failed:", err);
    // 如果失敗就留著原本的 option（或顯示錯誤）
  }
}

// 1️⃣ 先抓到畫面上的元素
const form = document.getElementById("searchForm");
const resultArea = document.getElementById("resultArea");

// 2️⃣ 監聽「按下搜尋」
form.addEventListener("submit", function (event) {
  // ❗ 為什麼要 preventDefault？
  // 因為 form 預設會重新整理頁面，我們不要
  event.preventDefault();

  // 3️⃣ 從各個欄位拿值
  const fromStopId = document.getElementById("fromStop").value;
  const toStopId = document.getElementById("toStop").value;
  const afterTime = document.getElementById("afterTime").value;
  const bufferMin = Number(document.getElementById("bufferMin").value);

  // 4️⃣ 組成一個「之後會送給後端的物件」
  const payload = {
    from_stop_id: fromStopId,
    to_stop_id: toStopId,
    after_time: afterTime,
    buffer_min: bufferMin,
  };

  // 5️⃣ 先印出來確認
  console.log("🔎 Search payload:", payload);

  // 6️⃣ 先用假資料當作搜尋結果
  //renderPlans(fakeResponse.plans);
  // 6️⃣ 改成真的呼叫後端 /search
  runSearch(payload);
});

// 7️⃣ 清除按鈕（順手做）
document.getElementById("btnClear").addEventListener("click", function () {
  resultArea.textContent = "尚未搜尋";
});

// 🔁 交換起訖（From / To）
document.getElementById("btnSwap").addEventListener("click", function () {
  const fromSelect = document.getElementById("fromStop");
  const toSelect = document.getElementById("toStop");

  const tmp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tmp;
});

// 🔧 假的後端回傳資料（之後會被真的 /search 取代）
const fakeResponse = {
  plans: [
    {
      segments: [
        {
          mode: "BUS",
          from: "BUS_NCNU",
          to: "BUS_TAICHUNG_TRA",
          depart: "10:00",
          arrive: "11:22"
        }
      ]
    },
    {
      segments: [
        {
          mode: "BUS",
          from: "BUS_NCNU",
          to: "BUS_TAICHUNG_TRA",
          depart: "11:00",
          arrive: "12:22"
        },
        {
          mode: "TRA",
          from: "TRA_TAICHUNG",
          to: "TRA_KAOHSIUNG",
          depart: "12:30",
          arrive: "15:04"
        }
      ]
    }
  ]
};

// 專門負責「把 plans 顯示在畫面上」
function renderPlans(plans, bufferMin = 10) {
  if (!plans || plans.length === 0) {
    resultArea.innerHTML = `
      <div style="padding:12px;border:1px solid #ddd;border-radius:10px;">
        查無方案（可試試看改時間或改起訖站）
      </div>
    `;
    return;
  }

  resultArea.innerHTML = "";

  plans.forEach((plan, planIndex) => {
    const planDiv = document.createElement("div");
    planDiv.style.border = "1px solid #ddd";
    planDiv.style.borderRadius = "12px";
    planDiv.style.padding = "12px";
    planDiv.style.marginBottom = "12px";

    // 標題列：方案 + 風險 badge
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.gap = "10px";

    const title = document.createElement("h3");
    title.textContent = `方案 ${planIndex + 1}`;
    title.style.margin = "0";

    const badge = document.createElement("span");
    badge.style.padding = "6px 10px";
    badge.style.borderRadius = "999px";
    badge.style.fontWeight = "700";
    badge.style.fontSize = "12px";
    badge.style.border = "1px solid #ddd";

    header.appendChild(title);
    header.appendChild(badge);
    planDiv.appendChild(header);

    // ✅ 方案摘要：轉乘等待 & 風險（你之前做的邏輯，包裝成 badge）
    if (plan.segments.length <= 1) {
      badge.textContent = "LOW 🟢（直達）";
      badge.style.color = "seagreen";
      badge.style.borderColor = "seagreen";
    } else {
      const waits = [];
      for (let i = 0; i < plan.segments.length - 1; i++) {
        const arrive = timeToMin(plan.segments[i].arrive);
        const nextDepart = timeToMin(plan.segments[i + 1].depart);
        waits.push(nextDepart - arrive);
      }
      const minWait = Math.min(...waits);
      const level = riskLevel(minWait, bufferMin);

      if (level === "HIGH") {
        badge.textContent = `HIGH 🔴（最短等 ${fmtMin(minWait)}）`;
        badge.style.color = "crimson";
        badge.style.borderColor = "crimson";
      } else if (level === "MEDIUM") {
        badge.textContent = `MEDIUM 🟡（最短等 ${fmtMin(minWait)}）`;
        badge.style.color = "goldenrod";
        badge.style.borderColor = "goldenrod";
      } else {
        badge.textContent = `LOW 🟢（最短等 ${fmtMin(minWait)}）`;
        badge.style.color = "seagreen";
        badge.style.borderColor = "seagreen";
      }

      const waitLine = document.createElement("div");
      waitLine.style.marginTop = "8px";
      waitLine.style.color = "#555";
      waitLine.textContent = `轉乘等待：${waits.map(fmtMin).join(" / ")}（緩衝 ${bufferMin} 分）`;
      planDiv.appendChild(waitLine);
    }

    // 分隔線
    const hr = document.createElement("div");
    hr.style.margin = "10px 0";
    hr.style.borderTop = "1px dashed #ddd";
    planDiv.appendChild(hr);

    // ✅ segments 區塊顯示（更好讀）
    plan.segments.forEach((seg, idx) => {
      const fromName = stopMap[seg.from] || seg.from;
      const toName = stopMap[seg.to] || seg.to;

      const segBox = document.createElement("div");
      segBox.style.border = "1px solid #eee";
      segBox.style.borderRadius = "10px";
      segBox.style.padding = "10px";
      segBox.style.marginBottom = "8px";
      segBox.style.background = "#fafafa";

      const line1 = document.createElement("div");
      line1.style.fontWeight = "700";
      line1.textContent = `${idx + 1}. ${seg.mode}｜${fromName} → ${toName}`;

      const line2 = document.createElement("div");
      line2.style.color = "#555";
      line2.style.marginTop = "4px";
      line2.textContent = `${seg.depart} → ${seg.arrive}`;

      segBox.appendChild(line1);
      segBox.appendChild(line2);

      planDiv.appendChild(segBox);
    });

    resultArea.appendChild(planDiv);
  });
}


// 專門負責「打後端 API」拿 plans
async function runSearch(payload) {
  try {
    resultArea.textContent = "查詢中...";

    const res = await fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_stop_id: payload.from_stop_id,
        to_stop_id: payload.to_stop_id,
        after_time: payload.after_time,
      }),
    });

    if (!res.ok) {
      throw new Error("後端回傳錯誤 status=" + res.status);
    }

    const data = await res.json();

    // ✅ 防呆：確保 plans 一定是陣列
    const plans = Array.isArray(data?.plans) ? data.plans : [];

    console.log("✅ /search response:", data);
    console.log("✅ plans length:", plans.length);

    renderPlans(plans, payload.buffer_min);
  } catch (err) {
    console.error("❌ runSearch error:", err);
    resultArea.innerHTML = `
    <div style="padding:12px;border:1px solid #ddd;border-radius:10px;">
        查詢失敗 😭<br/>
        可能原因：<br/>
        1) 後端沒開（請確認 uvicorn 還在跑）<br/>
        2) /search 回傳格式不對（看 console 的 response）<br/>
    </div>
    `;
  }
}

// "HH:mm" -> minutes (e.g. "10:30" -> 630)
function timeToMin(hhmm) {
  const [h, m] = (hhmm || "").split(":").map(Number);
  return h * 60 + m;
}

// minutes -> "X 分"
function fmtMin(n) {
  return `${n} 分`;
}

// 依等待時間與 buffer 回傳風險等級
function riskLevel(waitMin, bufferMin) {
  if (waitMin < bufferMin) return "HIGH";          // 🔴 不夠緩衝
  if (waitMin <= bufferMin + 10) return "MEDIUM";  // 🟡 剛好/偏緊
  return "LOW";                                    // 🟢 很充裕
}
