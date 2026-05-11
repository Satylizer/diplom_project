import models from "../models/models.js"
import ApiError from "../error/ApiError.js"
import { Op } from "sequelize"

const { User, Song, Likes, History } = models

class MlDataController {

  async getAllUsers(req, res, next) {
    try {

      const users = await User.findAll({
        attributes: ['id'],
        raw: true
      })

      return res.json(
        users.map(u => u.id)
      )

    } catch (e) {
      next(ApiError.internal(e.message))
    }
  }

  async getAllSongs(req, res, next) {
    try {

      const songs = await Song.findAll({
        where: {
          embedding: {
            [Op.ne]: null
          }
        },
        attributes: ['id', 'embedding'],
        raw: true
      })

      return res.json(songs)

    } catch (e) {
      next(ApiError.internal(e.message))
    }
  }

  async getUserSequence(req, res, next) {
    try {
      const userId = req.params.id

      const songs = await Song.findAll({
        where: { embedding: { [Op.ne]: null } },
        attributes: ['id', 'embedding'],
        raw: true
      })

      const songMap = new Map(
        songs.map(s => [s.id, s.embedding])
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
          timestamp: new Date(item.playedAt).getTime()
        })
      }

      for (const item of likes) {
        const embedding = songMap.get(item.songId)
        if (!embedding) continue

        sequence.push({
          songId: item.songId,
          songEmbedding: embedding,
          eventType: 1,
          timestamp: new Date(item.createdAt).getTime()
        })
      }

      sequence.sort((a, b) => a.timestamp - b.timestamp)

      for (let i = 0; i < sequence.length; i++) {
        if (i === 0) {
          sequence[i].timeDeltaHours = 0
          continue
        }

        sequence[i].timeDeltaHours =
          (sequence[i].timestamp - sequence[i - 1].timestamp) / (1000 * 60 * 60)
      }

      return res.json(sequence)

    } catch (e) {
      next(ApiError.internal(e.message))
    }
  }
}

export default new MlDataController()