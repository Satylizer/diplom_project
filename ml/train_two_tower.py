import tensorflow as tf
import json
import os

from two_tower import TwoTowerEmbeddings
from dataset.build_dataset import build_dataset
from dataset.build_user_tensor import build_user_tensor
from api.get_data import load_dataset


def train():

    try:
        users, songs, sequences = load_dataset()

        all_songs = songs

        if len(all_songs) == 0:
            raise Exception("Songs not found")

        embedding_length = len(all_songs[0]["embedding"])

        user_inputs = []
        song_inputs = []
        labels = []

        for user_id in users:

            sequence = sequences.get(str(user_id), [])

            samples = build_dataset(
                sequence=sequence,
                all_songs=all_songs,
                sequence_length=10,
                negative_per_positive=1,
                embedding_length=embedding_length
            )

            for s in samples:

                user_inputs.append(s["user_tensor"])

                song_inputs.append(
                    s["song_embedding"]
                )

                labels.append([
                    float(s["is_positive"])
                ])

        if len(user_inputs) == 0:
            raise Exception("No training samples")

        userX = tf.convert_to_tensor(
            user_inputs,
            dtype=tf.float32
        )

        songX = tf.convert_to_tensor(
            song_inputs,
            dtype=tf.float32
        )

        y = tf.convert_to_tensor(
            labels,
            dtype=tf.float32
        )

        print("DATA INFO", {
            "users": len(users),
            "tracks": len(all_songs),
            "samples": len(user_inputs)
        })

        base_model = TwoTowerEmbeddings(
            sequence_length=10,
            embedding_length=embedding_length
        )

        user_input = tf.keras.Input(
            shape=(10, embedding_length + 3)
        )

        song_input = tf.keras.Input(
            shape=(embedding_length,)
        )

        user_vec = base_model.user_encoder(user_input)
        song_vec = base_model.song_encoder(song_input)

        dot = tf.keras.layers.Dot(
            axes=1
        )([user_vec, song_vec])

        output = tf.keras.layers.Activation(
            "sigmoid"
        )(dot)

        training_model = tf.keras.Model(
            inputs=[user_input, song_input],
            outputs=output
        )

        training_model.compile(
            optimizer=tf.keras.optimizers.Adam(0.001),
            loss=tf.keras.losses.BinaryCrossentropy(),
            metrics=["accuracy"]
        )

        print("TRAINING STARTED")

        training_model.fit(
            [userX, songX],
            y,
            epochs=5,
            batch_size=64,
            shuffle=True
        )

        print("TRAINING FINISHED")

        os.makedirs("./data", exist_ok=True)
        
        training_model.save("./data/two_tower_model.keras")

        user_embeddings = []
        song_embeddings = []

        for user_id in users:

            sequence = sequences.get(str(user_id), [])

            user_tensor = tf.convert_to_tensor(
                [build_user_tensor(sequence, embedding_length)],
                dtype=tf.float32
            )

            emb = base_model.user_encoder(
                user_tensor
            ).numpy()[0]

            user_embeddings.append({
                "userId": user_id,
                "embedding": emb.tolist()
            })

        for song in all_songs:

            song_tensor = tf.convert_to_tensor(
                [song["embedding"]],
                dtype=tf.float32
            )

            emb = base_model.song_encoder(
                song_tensor
            ).numpy()[0]

            song_embeddings.append({
                "songId": song["id"],
                "embedding": emb.tolist()
            })

        with open("./data/user_embeddings.json", "w") as f:
            json.dump(user_embeddings, f)

        with open("./data/song_embeddings.json", "w") as f:
            json.dump(song_embeddings, f)

    except Exception as err:
        print("TRAIN FAILED")
        print(err)


train()