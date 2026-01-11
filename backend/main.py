from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"ok":True}

@app.post("/search")
def search():
    return {
        "plans": [
            {
                "segments": [
                    {
                        "mode":"BUS",
                        "from":"NCNU",
                        "to":"TAICHUNG_HSR",
                        "depart":"10:00",
                        "arrive":"12:00"
                    }
                ]
            }
        ]
    }