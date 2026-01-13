from fastapi import FastAPI
from pydantic import BaseModel  # 要求格式（裝前端資料的盒子）
from fastapi.responses import FileResponse
from pathlib import Path

# B 的工具
from backend.app.core.data_loader import load_datastore  # 讀全部的資料 (stops / bus / tra / hsr)
from backend.app.core.direct_search import find_direct_trips  # 篩選直達班次

app = FastAPI()


class SearchRequest(BaseModel):
    # 前端呼叫 /search 時，必須傳這三個欄位
    from_stop_id: str
    to_stop_id: str
    after_time: str  # 格式先用 "HH:mm"


# 確認後端狀態用
@app.get("/health")
def health():
    return {"ok": True}

# 可以從檔案雙擊打開
@app.get("/")
def index():
    # 專案根目錄
    repo_root = Path(__file__).resolve().parents[1]
    # frontend/search.html
    html_path = repo_root / "frontend" / "search.html"
    return FileResponse(html_path)

# 讓前端拿到 stop 瀏覽器打開 http://127.0.0.1:8000/stops 可以看到 json
@app.get("/stops")
def get_stops():
    store = load_datastore()
    return {"stops": store.stops}


@app.get("/search.js")
def search_js():
    repo_root = Path(__file__).resolve().parents[1]
    js_path = repo_root / "frontend" / "search.js"
    return FileResponse(js_path)

@app.post("/search")
def search(req: SearchRequest):
    # 載入所有靜態資料
    store = load_datastore()

    # 同時查三種運具的「直達班次」
    # 這裡假設前端會傳對應的 stop_id（例如 BUS_NCNU、TRA_TAICHUNG）
    bus_results = find_direct_trips(
        trips=store.bus_trips,
        from_stop_id=req.from_stop_id,
        to_stop_id=req.to_stop_id,
        after_time=req.after_time,
        limit=5,
    )

    tra_results = find_direct_trips(
        trips=store.tra_trips,
        from_stop_id=req.from_stop_id,
        to_stop_id=req.to_stop_id,
        after_time=req.after_time,
        limit=5,
    )

    hsr_results = find_direct_trips(
        trips=store.hsr_trips,
        from_stop_id=req.from_stop_id,
        to_stop_id=req.to_stop_id,
        after_time=req.after_time,
        limit=5,
    )

    # 把結果統一包成 plans/segments（前端會比較好接）
    plans = []

    def append_plans(results, mode):
        for t in results:  # 可能符合的不只一筆 所以用 for 一筆筆處理
            plans.append(
                {
                    "segments": [
                        {
                            "mode": mode,
                            "from": t["from_stop_id"],
                            "to": t["to_stop_id"],
                            "depart": t["depart_time"],
                            "arrive": t["arrive_time"],
                        }   
                    ]
                }
            )

    append_plans(bus_results, "BUS")
    append_plans(tra_results, "TRA")
    append_plans(hsr_results, "HSR")

    # 都查不到就回空
    return {"plans": plans}

