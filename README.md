# NextRide 轉車小助手

## 功能架構
<img width="1118" height="612" alt="螢幕擷取畫面 2026-01-04 210139" src="https://github.com/user-attachments/assets/6456424c-22bb-4be4-9797-16e85b93399d" />

## 檔案說明
### phase2 站點及路線
- `stops.json` 各站點(公車/高鐵/火車)

- `bus_trips.json` 公車站到站路線
- BUS NCNU→TC_HSR：目前收錄平日行駛班次（13班），發車時間區間 10:00–17:00
- BUS NCNU→TC_TRA：目前收錄平日行駛班次（7班），發車時間區間 10:00–17:00

- `hsr_trips.json` 高鐵站到站路線 
- HSR TC→KS：目前收錄每日行駛班次（13班），發車時間區間 09:48–21:48

- `tra_trips.json` 火車站到站路線
- TRA TC→KS：目前收錄每日行駛班次（13班），發車時間區間 09:51–21:19
- TRA KS→PT：目前收錄每日行駛班次（13班），發車時間區間 11:00–23:05

### phase3 後端
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
