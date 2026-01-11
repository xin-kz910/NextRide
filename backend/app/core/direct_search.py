from typing import List, Dict, Any, Optional


def _time_to_minutes(t: str) -> int:
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def find_direct_trips(
    trips: List[Dict[str, Any]],
    from_stop_id: str,
    to_stop_id: str,
    after_time: str,
    limit: Optional[int] = 5,
) -> List[Dict[str, Any]]:
    

    after_minutes = _time_to_minutes(after_time)

    matched: List[Dict[str, Any]] = []

    for trip in trips:
        if trip.get("from_stop_id") != from_stop_id:
            continue
        if trip.get("to_stop_id") != to_stop_id:
            continue

        depart_time = trip.get("depart_time")
        if not depart_time:
            continue

        if _time_to_minutes(depart_time) >= after_minutes:
            matched.append(trip)

    matched.sort(key=lambda t: t["depart_time"])

    if limit is None:
        return matched

    return matched[:limit]
