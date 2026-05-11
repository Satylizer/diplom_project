from fastapi import FastAPI, Query
from recommender import RecommenderService

app = FastAPI()

service = RecommenderService()

# uvicorn api.api:app --host 0.0.0.0 --port 8000 --reload

@app.get("/recommendations/sequence/{user_id}")
def sequence_recommendations(
    user_id: int,
    top_k: int = Query(100, ge=1, le=500)
):

    recs = service.get_sequence_recommendations(
        user_id,
        top_k
    )

    return recs


@app.get("/recommendations/same-energy/{song_id}")
def same_energy_recommendations(
    song_id: int,
    top_k: int = Query(100, ge=1, le=500)
):

    recs = service.get_same_energy_recommendations(
        song_id,
        top_k
    )

    return recs