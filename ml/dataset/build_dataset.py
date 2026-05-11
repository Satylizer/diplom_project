import random

from .build_user_tensor import build_user_tensor

def build_dataset(
    sequence,
    all_songs,
    sequence_length=10,
    negative_per_positive=1,
    embedding_length=None
):
    samples = []

    if not sequence or len(sequence) < sequence_length + 1:
        return samples

    seen_songs = set([e["songId"] for e in sequence])

    negative_pool = [
        song for song in all_songs
        if song["id"] not in seen_songs
    ]

    if len(negative_pool) == 0:
        return samples

    for i in range(sequence_length, len(sequence)):

        context = sequence[i - sequence_length:i]
        target = sequence[i]

        user_tensor = build_user_tensor(context, embedding_length)

        samples.append({
            "user_tensor": user_tensor,
            "song_embedding": target["songEmbedding"],
            "is_positive": 1
        })

        for _ in range(negative_per_positive):

            negative_song = random.choice(negative_pool)

            samples.append({
                "user_tensor": user_tensor,
                "song_embedding": negative_song["embedding"],
                "is_positive": 0
            })

    return samples