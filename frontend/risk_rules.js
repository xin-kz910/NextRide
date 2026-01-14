function parseHHmm(t) {
  if (typeof t !== "string") return null;
  const s = t.trim();
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;

  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;

  return hh * 60 + mm;
}


function getTime(seg, keyNew, keyOld) {
  return seg?.[keyNew] ?? seg?.[keyOld] ?? "";
}


function normalizeBuffer(buffer) {
  const n = Number(buffer);
  if (!Number.isFinite(n)) return 10; 
  if (n < 0) return 0;
  if (n > 180) return 180; 
  return Math.floor(n);
}


export function timeToMinutes(t) {
  return parseHHmm(t);
}


export function calcTransferWaits(segments) {
  const waits = [];
  const segs = Array.isArray(segments) ? segments : [];

  for (let i = 0; i < segs.length - 1; i++) {
    const arrive = getTime(segs[i], "arrive_time", "arrive");
    const nextDepart = getTime(segs[i + 1], "depart_time", "depart");

    const a = parseHHmm(arrive);
    const d = parseHHmm(nextDepart);
    if (a === null || d === null) continue;

    waits.push({ minutes: d - a, fromIndex: i, toIndex: i + 1 });
  }

  return waits;
}


export function calcRiskColor(segments, buffer = 10) {
  const b = normalizeBuffer(buffer);
  const waits = calcTransferWaits(segments);

  if (waits.length === 0) return "green";

  
  if (waits.some((w) => w.minutes < 0)) return "red";


  if (waits.some((w) => w.minutes < 3)) return "red";

 
  if (waits.some((w) => w.minutes < b)) return "yellow";

 
  return "green";
}


export function calcTotalMinutes(segments) {
  const segs = Array.isArray(segments) ? segments : [];
  if (segs.length === 0) return 0;

  const firstDepart = getTime(segs[0], "depart_time", "depart");
  const lastArrive = getTime(segs[segs.length - 1], "arrive_time", "arrive");

  const a = parseHHmm(lastArrive);
  const d = parseHHmm(firstDepart);
  if (a === null || d === null) return 0;

  const diff = a - d;
  return diff < 0 ? 0 : diff;
}


export function evaluatePlan(plan, buffer = 10) {
  const segments = plan?.segments || [];
  const waits = calcTransferWaits(segments);
  const total_minutes = calcTotalMinutes(segments);
  const risk_color = calcRiskColor(segments, buffer);


  let reason = "";
  if (risk_color === "red") {
    const bad = waits.find((w) => w.minutes < 0 || w.minutes < 3);
    if (bad) reason = bad.minutes < 0 ? "接不上（下一段出發早於到達）" : "轉乘過短（< 3 分）";
  } else if (risk_color === "yellow") {
    reason = "轉乘偏趕（低於 buffer）";
  }

  return {
    is_valid: true, 
    waits,
    total_minutes,
    risk_color,
    reason,
  };
}
