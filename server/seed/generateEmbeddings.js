import 'dotenv/config'
import sequelize from "../db.js"
import models from "../models/models.js"

const { Song, Artist, Album } = models
import { pipeline } from '@xenova/transformers'

async function generateEmbeddings() {
    try {
        await sequelize.authenticate()
        console.log("Connected to DB\n")

        console.log("Loading model...")
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
        console.log("Model loaded\n")

        const songs = await Song.findAll({
            where: { embedding: null },
            include: [
                { model: Artist, as: 'artists', attributes: ['name'] },
                { model: Album, attributes: ['title'] }
            ]
        })

        console.log(`Found ${songs.length} songs\n`)

        for (let i = 0; i < songs.length; i++) {
            const song = songs[i]
            
            const artistNames = song.artists?.map(a => a.name).join(', ') || ''
            const albumName = song.album?.title || ''
            
            let text = `${song.name} | ${artistNames} | ${albumName}`
            
            if (song.audioFeatures) {
                text += ` | dance:${song.audioFeatures.danceability} energy:${song.audioFeatures.energy} valence:${song.audioFeatures.valence} tempo:${song.audioFeatures.tempo} acoustic:${song.audioFeatures.acousticness} instrumental:${song.audioFeatures.instrumentalness} speech:${song.audioFeatures.speechiness} live:${song.audioFeatures.liveness} loud:${song.audioFeatures.loudness} key:${song.audioFeatures.key} mode:${song.audioFeatures.mode}`
            }
            
            console.log(`[${i + 1}/${songs.length}] ${song.name}`)
            
            const result = await extractor(text, { 
                pooling: 'mean', 
                normalize: true 
            })
            
            const embedding = Array.from(result.data)
            
            await song.update({ embedding })
        }

        console.log("All embeddings generated")
        process.exit(0)
        
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

generateEmbeddings()