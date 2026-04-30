import { Client } from 'spotify-api.js';
import ApiError from "../error/ApiError.js";

class SpotifyApi {
    constructor() {
        this.client = null
        this.initialized = false
    }

    async init() {
        try {
            this.client = await Client.create({
                refreshToken: true,
                token: {
                    clientID: process.env.SPOTIFY_CLIENT_ID,
                    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
                }
            });
            this.initialized = true
            return this.client
        } catch (e) {
            throw ApiError.internal(`Ошибка инициализации Spotify API: ${e.message}`)
        }
    }

    async getClient() {
        if (!this.initialized) {
            await this.init()
        }
        return this.client
    }

    async getToken() {
        const client = await this.getClient()
        return client.token
    }
}

export default new SpotifyApi()