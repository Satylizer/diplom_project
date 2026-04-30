import crypto from 'crypto';
import ApiError from '../error/ApiError.js';

class YandexApi {
    constructor() {
        this.token = process.env.YANDEX_MUSIC_TOKEN
        this.baseUrl = process.env.YANDEX_BASE_URL
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `OAuth ${this.token}`,
                'Accept-Language': 'ru',
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw ApiError.internal(`Ошибка API: ${response.statusText}`)
        }

        return response.json()
    }

    async searchTracks(query, limit = 10) {
        const data = await this.request(`/search?text=${encodeURIComponent(query)}&type=track&page=0&pageSize=${limit}`)
        return data.result?.tracks?.results || []
    }

    async getTrack(trackId) {
        const data = await this.request(`/tracks/${trackId}`)
        return data.result
    }

    async getDownloadInfo(trackId) {
        const data = await this.request(`/tracks/${trackId}/download-info`)
        return data.result || data
    }
}

export default new YandexApi();