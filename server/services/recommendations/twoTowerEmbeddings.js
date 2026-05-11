import tf from '@tensorflow/tfjs'

export default class TwoTowerEmbeddings {

  constructor({
    sequenceLength = 10,
    embeddingLength
  }) {

    this.sequenceLength = sequenceLength
    this.embeddingLength = embeddingLength

    this.userEncoder = this.createUserEncoder()
    this.songEncoder = this.createSongEncoder()
  }

  createUserEncoder() {

    const input = tf.input({
      shape: [
        this.sequenceLength,
        this.embeddingLength + 3
      ]
    })

    let x = tf.layers.gru({
      units: 128,
      returnSequences: false
    }).apply(input)

    x = tf.layers.dense({
      units: 64,
      activation: 'relu'
    }).apply(x)

    const userEmbedding = tf.layers.dense({
      units: 64,
      name: 'user_embedding'
    }).apply(x)

    return tf.model({
      inputs: input,
      outputs: userEmbedding,
      name: 'user_encoder'
    })
  }

  createSongEncoder() {

    const input = tf.input({
      shape: [this.embeddingLength]
    })

    let x = tf.layers.dense({
      units: 128,
      activation: 'relu'
    }).apply(input)

    const songEmbedding = tf.layers.dense({
      units: 64,
      name: 'song_embedding'
    }).apply(x)

    return tf.model({
      inputs: input,
      outputs: songEmbedding,
      name: 'song_encoder'
    })
  }

  getUserEmbedding(sequenceTensor) {
    return this.userEncoder.predict(sequenceTensor)
  }

  getSongEmbedding(songTensor) {
    return this.songEncoder.predict(songTensor)
  }
}