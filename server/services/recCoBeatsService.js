import axios from 'axios'

class RecCoBeatsService {
    constructor() {
        this.baseURL = 'https://api.reccobeats.com/v1'
    }

    headers() {
        return {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0',
            Origin: 'https://reccobeats.com',
            Referer: 'https://reccobeats.com/'
        }
    }

    extractSpotifyId(url) {
        if (!url) return null
        const clean = url.split('?')[0]
        return clean.split('/track/')[1] ?? null
    }

    async getAlbumBySpotifyId(spotifyAlbumId) {
        const res = await axios.get(
            `${this.baseURL}/album?ids=${spotifyAlbumId}`,
            { headers: this.headers(), validateStatus: () => true }
        )

        const album = res.data?.content?.[0]

        console.log(album.name);
        console.log(album.totalTracks);

        if (!album) {
            console.log(`[album] not found: ${spotifyAlbumId}`)
            return null
        }

        return album
    }

    async getAlbumTracks(recoAlbumId) {
        const res = await axios.get(
            `${this.baseURL}/album/${recoAlbumId}/track`,
            { headers: this.headers(), validateStatus: () => true }
        )

        if (res.status !== 200 || !res.data?.content) {
            console.log(`[tracks] not found or bad response: ${recoAlbumId}`)
            return []
        }

        const tracks = res.data.content

        console.log(tracks);

        return tracks
            .map(t => ({
                spotifyTrackId: this.extractSpotifyId(t.href),
                reccoTrackId: t.id,
                name: t.trackTitle ?? null
            }))
            .filter(t => {
                if (!t.spotifyTrackId || !t.reccoTrackId) {
                    console.log('[track] invalid track mapping:', t)
                    return false
                }
                return true
            })
    }

    async getAudioFeatures(trackId) {
        const res = await axios.get(
            `${this.baseURL}/track/${trackId}/audio-features`,
            { headers: this.headers(), validateStatus: () => true }
        )

        if (!res.data) {
            console.log(`[features] empty response for track: ${trackId}`)
            return null
        }

        const raw = res.data

        return {
            danceability: raw.danceability ?? 0,
            energy: raw.energy ?? 0,
            key: raw.key ?? 0,
            loudness: raw.loudness ?? 0,
            mode: raw.mode ?? 0,
            speechiness: raw.speechiness ?? 0,
            acousticness: raw.acousticness ?? 0,
            instrumentalness: raw.instrumentalness ?? 0,
            liveness: raw.liveness ?? 0,
            valence: raw.valence ?? 0,
            tempo: raw.tempo ?? 0
        }
    }

    async getAlbumFeaturesBySpotifyId(spotifyAlbumId) {
        const album = await this.getAlbumBySpotifyId(spotifyAlbumId)

        if (!album) {
            console.log(`[album] missing final step for ${spotifyAlbumId}`)
            return null
        }

        const tracks = await this.getAlbumTracks(album.id)

        if (!tracks.length) {
            console.log(`[tracks] empty list for album: ${album.id}`)
            return []
        }

        return await Promise.all(
            tracks.map(async t => {
                const features = await this.getAudioFeatures(t.reccoTrackId)

                if (!features) {
                    console.log(`[features] missing for track: ${t.reccoTrackId}`)
                }

                return {
                    spotifyTrackId: t.spotifyTrackId,
                    name: t.name,
                    features
                }
            })
        )
    }
}

export default new RecCoBeatsService()