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

        self.song_embeddings = self._normalize_matrix(self.song_embeddings)

        self.users, self.songs, self.sequences = load_dataset()

    def _normalize_vector(self, v):
        return v / np.linalg.norm(v)

    def _normalize_matrix(self, m):
        return m / np.linalg.norm(m, axis=1, keepdims=True)

    def get_sequence_recommendations(self, user_id: int, top_k: int = 100):

        sequence = self.sequences.get(str(user_id), [])

        if not sequence:
            return []

        heard = {item["songId"] for item in sequence}

        embedding_length = self.song_embeddings.shape[1]

        user_tensor = np.array(
            [build_user_tensor(sequence, embedding_length)],
            dtype=np.float32
        )

        user_emb = self.model.get_layer("user_encoder")(user_tensor).numpy()[0]
        user_emb = self._normalize_vector(user_emb)

        scores = np.dot(self.song_embeddings, user_emb)

        top_idx = np.argsort(scores)[::-1]

        filtered = [
            i for i in top_idx
            if self.song_ids[i] not in heard
        ][:top_k]

        return [
            {
                "songId": self.song_ids[i],
                "score": float(scores[i])
            }
            for i in filtered
        ]
        
    def get_same_energy_recommendations(self, user_id: int, top_k: int = 100):

        sequence = self.sequences.get(str(user_id), [])

        if not sequence:
            return []

        heard = {item["songId"] for item in sequence}

        seed_embeddings = [
            self.song_embeddings[self.song_ids.index(item["songId"])]
            for item in sequence
            if item["songId"] in self.song_ids
        ]

        if not seed_embeddings:
            return []

        seed_embedding = np.mean(seed_embeddings, axis=0)
        seed_embedding = self._normalize_vector(seed_embedding)

        scores = np.dot(self.song_embeddings, seed_embedding)

        top_idx = np.argsort(scores)[::-1]

        filtered = [
            i for i in top_idx
            if self.song_ids[i] not in heard
        ][:top_k]

        return [
            {
                "songId": self.song_ids[i],
                "score": float(scores[i])
            }
            for i in filtered
        ]