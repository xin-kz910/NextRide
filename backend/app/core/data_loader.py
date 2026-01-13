from pathlib import Path
import json
from typing import Dict, List, Any
from dataclasses import dataclass
#from .direct_search import find_direct_trips



@dataclass
class DataStore:
    
    #統一保存所有靜態資料，讓後端其他地方只要拿這一包就好

    stops: List[Dict[str, Any]]
    bus_trips: List[Dict[str, Any]]
    tra_trips: List[Dict[str, Any]]
    hsr_trips: List[Dict[str, Any]]




def _load_json(path: Path) -> Dict[str, Any]:

    if not path.exists():
        raise FileNotFoundError(f"找不到資料檔案：{path}")

    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _get_repo_root() -> Path:
    
    return Path(__file__).resolve().parents[3] #parents[3]是從目前檔案位置推回專案根目錄(core [0]-> app [1]-> backend [2]-> repo_root [3])



def load_datastore() -> DataStore:

    #載入 stops 與所有運輸工具 trips，回傳統一的 DataStore
    repo_root = _get_repo_root()
    data_dir = repo_root / "data"

    stops_obj = _load_json(data_dir / "stops.json")
    bus_obj = _load_json(data_dir / "bus_trips.json")
    tra_obj = _load_json(data_dir / "tra_trips.json")
    hsr_obj = _load_json(data_dir / "hsr_trips.json")

    return DataStore(
        stops=stops_obj.get("stops", []),
        bus_trips=bus_obj.get("trips", []),
        tra_trips=tra_obj.get("trips", []),
        hsr_trips=hsr_obj.get("trips", []),
    )







