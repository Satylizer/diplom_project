import tensorflow as tf


def create_user_encoder(sequence_length, embedding_length):

    input_layer = tf.keras.Input(
        shape=(sequence_length, embedding_length + 3)
    )

    x = tf.keras.layers.GRU(
        128,
        return_sequences=False
    )(input_layer)

    x = tf.keras.layers.Dense(
        64,
        activation="relu"
    )(x)

    user_embedding = tf.keras.layers.Dense(
        64,
        name="user_embedding"
    )(x)

    return tf.keras.Model(
        inputs=input_layer,
        outputs=user_embedding,
        name="user_encoder"
    )


def create_song_encoder(embedding_length):

    input_layer = tf.keras.Input(
        shape=(embedding_length,)
    )

    x = tf.keras.layers.Dense(
        128,
        activation="relu"
    )(input_layer)

    song_embedding = tf.keras.layers.Dense(
        64,
        name="song_embedding"
    )(x)

    return tf.keras.Model(
        inputs=input_layer,
        outputs=song_embedding,
        name="song_encoder"
    )

class TwoTowerEmbeddings(tf.keras.Model):

    def __init__(self, sequence_length=10, embedding_length=128):
        super().__init__()

        self.sequence_length = sequence_length
        self.embedding_length = embedding_length

        self.user_encoder = create_user_encoder(sequence_length, embedding_length)
        self.song_encoder = create_song_encoder(embedding_length)

    def call(self, inputs):

        user_seq, song_vec = inputs

        user_emb = self.user_encoder(user_seq)
        song_emb = self.song_encoder(song_vec)

        logits = tf.reduce_sum(user_emb * song_emb, axis=1)

        return tf.nn.sigmoid(logits)