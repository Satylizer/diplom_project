const { User, Song, History, Likes, Artist, sequelize } = require('../models/models');
const { Op } = require('sequelize');

class ProfileService {
    
    /**
     * Получить эмбеддинг профиля пользователя
     * Усредняет эмбеддинги всех лайкнутых/прослушанных треков пользователя
     */
    async getUserEmbedding(userId) {
        // 1. Получаем все треки, с которыми взаимодействовал пользователь
        const likes = await Likes.findAll({
            where: { userId },
            include: [{
                model: Song,
                as: 'song',
                include: ['artists', 'album']
            }]
        });
        
        const history = await History.findAll({
            where: { userId },
            include: [{
                model: Song,
                as: 'song',
                include: ['artists', 'album']
            }],
            limit: 100,
            order: [['playedAt', 'DESC']]
        });
        
        // 2. Объединяем и вычисляем веса (лайки > прослушивания)
        const trackScores = new Map();
        
        for (const like of likes) {
            const trackId = like.song.id;
            trackScores.set(trackId, {
                song: like.song,
                weight: 2.0  // лайк = вес 2
            });
        }
        
        for (const hist of history) {
            const trackId = hist.song.id;
            const existing = trackScores.get(trackId);
            if (existing) {
                existing.weight += 0.5;  // прослушивание добавляет вес
            } else {
                trackScores.set(trackId, {
                    song: hist.song,
                    weight: 0.5
                });
            }
        }
        
        // 3. Превращаем в эмбеддинги (векторное представление треков)
        const trackEmbeddings = [];
        const weights = [];
        
        for (const [_, data] of trackScores) {
            const embedding = await this.getTrackEmbedding(data.song);
            trackEmbeddings.push(embedding);
            weights.push(data.weight);
        }
        
        if (trackEmbeddings.length === 0) {
            return null;  // холодный старт
        }
        
        // 4. Усредняем с весами = профиль пользователя
        const userEmbedding = this.weightedAverage(trackEmbeddings, weights);
        
        return {
            userId,
            embedding: userEmbedding,
            trackCount: trackEmbeddings.length,
            topGenres: await this.getTopGenres(userId)
        };
    }
    
    /**
     * Получить эмбеддинг трека (512-мерный вектор)
     * Пока заглушка — можно расширить позже
     */
    async getTrackEmbedding(song) {
        // TODO: позже подключим реальную модель (CLAP, MERT)
        // Пока генерируем псевдо-эмбеддинг на основе метаданных
        
        const artistNames = song.artists?.map(a => a.name).join(' ') || '';
        const text = `${song.name} ${artistNames}`;
        
        // Простейшая хэш-функция для демонстрации
        // В реальности заменим на CLAP/MERT
        const hash = this.simpleHash(text);
        const embedding = new Array(128).fill(0);
        for (let i = 0; i < Math.min(hash.length, embedding.length); i++) {
            embedding[i] = (hash.charCodeAt(i) % 100) / 100;
        }
        
        return embedding;
    }
    
    /**
     * Усреднение векторов с весами
     */
    weightedAverage(vectors, weights) {
        const dim = vectors[0].length;
        const result = new Array(dim).fill(0);
        let totalWeight = 0;
        
        for (let i = 0; i < vectors.length; i++) {
            const weight = weights[i];
            totalWeight += weight;
            for (let j = 0; j < dim; j++) {
                result[j] += vectors[i][j] * weight;
            }
        }
        
        if (totalWeight > 0) {
            for (let j = 0; j < dim; j++) {
                result[j] /= totalWeight;
            }
        }
        
        return result;
    }
    
    /**
     * Получить топ-жанры пользователя
     */
    async getTopGenres(userId, limit = 5) {
        // Агрегируем жанры из истории и лайков
        const genres = await sequelize.query(`
            SELECT a.genre, COUNT(*) as count
            FROM likes l
            JOIN song s ON l.song_id = s.id
            JOIN album a ON s.album_id = a.id
            WHERE l.user_id = ${userId}
            GROUP BY a.genre
            ORDER BY count DESC
            LIMIT ${limit}
        `, { type: sequelize.QueryTypes.SELECT });
        
        return genres;
    }
    
    /**
     * Простейшая хэш-функция для демонстрации
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString();
    }
    
    /**
     * Косинусное расстояние между двумя векторами
     */
    cosineSimilarity(vecA, vecB) {
        let dot = 0, magA = 0, magB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            magA += vecA[i] * vecA[i];
            magB += vecB[i] * vecB[i];
        }
        return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    }
}

module.exports = new ProfileService();