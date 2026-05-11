import { buildUserTensor } from './buildUserTensor.js'

export function buildDataset(
  sequence,
  allSongs,
  sequenceLength = 10,
  negativePerPositive = 1,
  embeddingLength
) {

  const samples = []

  if (!sequence || sequence.length < sequenceLength + 1) {
    return samples
  }

  const seenSongs = new Set(
    sequence.map(e => e.songId)
  )

  const negativePool = allSongs.filter(
    song => !seenSongs.has(song.id)
  )

  if (negativePool.length === 0) return samples

  for (let i = sequenceLength; i < sequence.length; i++) {

    const context = sequence.slice(i - sequenceLength, i)
    const target = sequence[i]

    const userTensor =
      buildUserTensor(context, embeddingLength)

    samples.push({
      userTensor,
      songEmbedding: target.songEmbedding,
      isPositive: 1
    })

    for (let n = 0; n < negativePerPositive; n++) {

      const negativeSong =
        negativePool[
          Math.floor(Math.random() * negativePool.length)
        ]

      samples.push({
        userTensor,
        songEmbedding: negativeSong.embedding,
        isPositive: 0
      })
    }
  }

  return samples
}