import 'dotenv/config'
import tf from '@tensorflow/tfjs'
import sequelize from '../../db.js'

import UserDataService from './userDataService.js'
import TwoTowerEmbeddings from './TwoTowerEmbeddings.js'
import { buildDataset } from './dataset/buildDataset.js'

const userDataService = new UserDataService()

export async function train() {
  try {
    await sequelize.authenticate()

    const embeddingMap =
      await userDataService.getAllSongsEmbeddingMap()

    const allSongs = Array.from(embeddingMap.entries()).map(
      ([id, embedding]) => ({ id, embedding })
    )

    const users = await userDataService.getAllUsers()

    const embeddingLength = allSongs[0].embedding.length

    const userInputs = []
    const songInputs = []
    const labels = []

    for (const userId of users) {
      const sequence =
        await userDataService.getUserSequence(userId)

      const samples =
        buildDataset(sequence, allSongs, 10, 1, embeddingLength)

      for (const s of samples) {
        userInputs.push(s.userTensor)
        songInputs.push(s.songEmbedding)
        labels.push([s.isPositive])
      }
    }

    if (!userInputs.length) {
      throw new Error('No training samples')
    }

    const userX = tf.tensor3d(
      userInputs,
      [userInputs.length, 10, embeddingLength + 3]
    )

    const songX = tf.tensor2d(songInputs)
    const y = tf.tensor2d(labels)

    console.log('DATA INFO', {
      users: users.length,
      tracks: allSongs.length,
      samples: userInputs.length
    })

    const model = new TwoTowerEmbeddings({
      sequenceLength: 10,
      embeddingLength
    })

    const userInput = model.userEncoder.input
    const songInput = model.songEncoder.input

    const userVec = model.userEncoder.apply(userInput)
    const songVec = model.songEncoder.apply(songInput)

    const dot = tf.layers.dot({ axes: -1 }).apply([
      userVec,
      songVec
    ])

    const output = tf.layers.activation({
      activation: 'sigmoid'
    }).apply(dot)

    const trainingModel = tf.model({
      inputs: [userInput, songInput],
      outputs: output
    })

    trainingModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    })

    console.log('TRAINING STARTED')

    await trainingModel.fit(
      [userX, songX],
      y,
      {
        epochs: 5,
        batchSize: 64,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log({
              epoch: epoch + 1,
              loss: logs.loss,
              acc: logs.acc || logs.accuracy
            })
          }
        }
      }
    )

    console.log('TRAINING FINISHED')

    const userEmbeddings = await exportUserEmbeddings(
      model,
      users,
      embeddingLength
    )

    const songEmbeddings = await exportSongEmbeddings(
      model,
      allSongs
    )

    fs.writeFileSync('./data/user_embeddings.json', JSON.stringify(userEmbeddings))
    fs.writeFileSync('./data/song_embeddings.json', JSON.stringify(songEmbeddings))

  } catch (err) {
    console.error('TRAIN FAILED')
    console.error(err)
  } finally {
    await sequelize.close()
  }
}