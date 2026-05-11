import json
import numpy as np
import tensorflow as tf

from dataset.build_user_tensor import build_user_tensor
from api.get_data import load_dataset


MODEL_PATH = "./data/two_tower_model.keras"


class RecommenderService:

    def __init__(self):

        self.model = tf.keras.models.load_model(MODEL_PATH)

        with open("./data/song_embeddings.json", "r") as f:
            songs = json.load(f)

        self.song_ids = [s["songId"] for s in songs]

        self.song_embeddings = np.array(
            [s["embedding"] for s in songs],
            dtype=np.float32
        )

        self.song_embeddings = (
            self.song_embeddings /
            np.linalg.norm(
                self.song_embeddings,
                axis=1,
                keepdims=True
            )
        )

        self.users, songs, self.sequences = load_dataset()

    def get_sequence_recommendations(
        self,
        user_id: int,
        top_k: int = 100
    ):

        sequence = self.sequences.get(str(user_id), [])

        if not sequence:
            return []

        heard_song_ids = set(
            item["songId"]
            for item in sequence
        )

        embedding_length = self.song_embeddings.shape[1]

        user_tensor = np.array(
            [build_user_tensor(sequence, embedding_length)],
            dtype=np.float32
        )

        user_emb = self.model.get_layer(
            "user_encoder"
        )(user_tensor).numpy()[0]

        user_emb = (
            user_emb /
            np.linalg.norm(user_emb)
        )

        scores = np.dot(
            self.song_embeddings,
            user_emb
        )

        top_idx = np.argsort(scores)[::-1]

        filtered_idx = [
            i for i in top_idx
            if self.song_ids[i] not in heard_song_ids
        ][:top_k]

        return [
            {
                "songId": self.song_ids[i],
                "score": float(scores[i])
            }
            for i in filtered_idx
        ]

    def get_same_energy_recommendations(
        self,
        song_id: int,
        top_k: int = 100
    ):

        if song_id not in self.song_ids:
            return []

        seed_idx = self.song_ids.index(song_id)

        seed_embedding = self.song_embeddings[seed_idx]

        scores = np.dot(
            self.song_embeddings,
            seed_embedding
        )

        top_idx = np.argsort(scores)[::-1]

        filtered_idx = [
            i for i in top_idx
            if self.song_ids[i] != song_id
        ][:top_k]

        return [
            {
                "songId": self.song_ids[i],
                "score": float(scores[i])
            }
            for i in filtered_idx
        ]