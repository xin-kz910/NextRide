# Core Module
將靜態 JSON 資料轉為後端可使用的查詢工具。

## 功能範圍

- 載入 `data/` 內的靜態資料（stops / bus / tra / hsr）
- 提供統一的資料存取結構（DataStore）
- 提供最基本的直達班次查詢（不含轉乘）

## 檔案說明

- `data_loader.py`
  - 讀取 `data/stops.json` 與 `data/*_trips.json`
  - 提供 `load_datastore()` 回傳 `DataStore`

- `direct_search.py`
  - 提供 `find_direct_trips()`
  - 依 `from_stop_id / to_stop_id / after_time` 篩選直達班次
  - `limit=None` 時回傳所有符合結果

- `manual_test.py`
  - 人工測試入口
  - 驗證資料是否正確載入與查詢邏輯是否正確

## 測試方式

在專案根目錄執行：
```bash
python -m backend.app.core.manual_test
