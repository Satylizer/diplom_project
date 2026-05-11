export default class UserDataService {

  async getAllUsers() {
    const users = await User.findAll({
      attributes: ['id'],
      raw: true
    })

    return users.map(u => u.id)
  }

  async getAllSongsEmbeddingMap() {

    const songs = await Song.findAll({
      where: { embedding: { [Op.ne]: null } },
      attributes: ['id', 'embedding'],
      raw: true
    })

    return songs.map(s => ({
      id: s.id,
      embedding: s.embedding
    }))
  }

  async getUserSequence(userId) {

    const songList = await this.getAllSongsEmbeddingMap()

    const songMap = new Map(
      songList.map(s => [s.id, s.embedding])
    )

    const likes = await Likes.findAll({
      where: { userId },
      attributes: ['songId', 'createdAt'],
      raw: true
    })

    const history = await History.findAll({
      where: { userId },
      attributes: ['songId', 'playedAt'],
      raw: true
    })

    const sequence = []

    for (const item of history) {
      const embedding = songMap.get(item.songId)
      if (!embedding) continue

      sequence.push({
        songId: item.songId,
        songEmbedding: embedding,
        eventType: 0,
        timestamp: Date.parse(item.playedAt)
      })
    }

    for (const item of likes) {
      const embedding = songMap.get(item.songId)
      if (!embedding) continue

      sequence.push({
        songId: item.songId,
        songEmbedding: embedding,
        eventType: 1,
        timestamp: Date.parse(item.createdAt)
      })
    }

    sequence.sort((a, b) => a.timestamp - b.timestamp)

    for (let i = 0; i < sequence.length; i++) {

      if (i === 0) {
        sequence[i].timeDeltaHours = 0
        continue
      }

      const prev = sequence[i - 1]
      const cur = sequence[i]

      sequence[i].timeDeltaHours =
        (cur.timestamp - prev.timestamp) / (1000 * 60 * 60)
    }

    return sequence
  }
}