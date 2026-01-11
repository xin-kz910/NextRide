from backend.app.core.data_loader import load_datastore
from backend.app.core.direct_search import find_direct_trips


def print_results(title: str, results: list, show: int = 5) -> None:
    print(f"\n=== {title} ===")
    print("count:", len(results))
    for r in results[:show]:
        print(f"- {r['trip_id']} {r['depart_time']} -> {r['arrive_time']}")


def main():
    store = load_datastore()

    # BUS：NCNU -> Taichung TRA（10:00 後）
    bus_res = find_direct_trips(
        trips=store.bus_trips,
        from_stop_id="BUS_NCNU",
        to_stop_id="BUS_TAICHUNG_TRA",
        after_time="10:00",
        limit=None,
    )
    print_results("BUS NCNU -> TAICHUNG_TRA after 10:00", bus_res)

    # BUS：NCNU -> Taichung TRA（23:59 後，應該查不到）
    bus_res_empty = find_direct_trips(
        trips=store.bus_trips,
        from_stop_id="BUS_NCNU",
        to_stop_id="BUS_TAICHUNG_TRA",
        after_time="23:59",
        limit=None,
    )
    print_results(
        "BUS NCNU -> TAICHUNG_TRA after 23:59 (expect empty)",
        bus_res_empty,
    )


    # TRA：Taichung -> Kaohsiung（10:00 後）
    tra_res = find_direct_trips(
        trips=store.tra_trips,
        from_stop_id="TRA_TAICHUNG_TRA",
        to_stop_id="TRA_KAOHSIUNG_TRA",
        after_time="10:00",
        limit=None,
    )
    print_results("TRA TAICHUNG -> KAOHSIUNG after 10:00", tra_res)

    # HSR：Taichung -> Kaohsiung HSR（10:00 後）
    hsr_res = find_direct_trips(
        trips=store.hsr_trips,
        from_stop_id="HSR_TAICHUNG_HSR",
        to_stop_id="HSR_KAOHSIUNG_HSR",
        after_time="10:00",
        limit=None,
    )
    print_results("HSR TAICHUNG -> KAOHSIUNG_HSR after 10:00", hsr_res)


if __name__ == "__main__":
    main()
