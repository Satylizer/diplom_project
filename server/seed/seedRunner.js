import 'dotenv/config'
import sequelize from "../db.js"
import {
    albumBatch1,
    albumBatch2,
    albumBatch3,
    albumBatch4,
    albumBatch5,
    albumBatch6,
    albumBatch7,
    albumBatch8,
    albumBatch9,
    albumBatch10
} from './Albums/seedAlbums_batch.js'
import SongImportService from "../services/SongImportService.js"

const BATCH = 1

const DELAY_BETWEEN_ALBUMS = 5000
const TRACK_DELAY = 300

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const batches = {
    1: albumBatch1,
    2: albumBatch2,
    3: albumBatch3,
    4: albumBatch4,
    5: albumBatch5,
    6: albumBatch6,
    7: albumBatch7,
    8: albumBatch8,
    9: albumBatch9,
    10: albumBatch10
}

const seedAlbums = batches[BATCH]

if (!seedAlbums) {
    throw new Error(`Invalid batch: ${BATCH}`)
}

const run = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        console.log(`Starting seed (batch ${BATCH})...\n`)

        for (let i = 0; i < seedAlbums.length; i++) {
            const item = seedAlbums[i]

            console.log(`[${i + 1}/${seedAlbums.length}] Loading ${item.artist} - ${item.album}`)

            let success = false
            let albumRetry = 0

            while (!success && albumRetry < 3) {
                try {
                    await SongImportService.loadAlbum(item.artist, item.album, {
                        trackDelay: TRACK_DELAY
                    })

                    console.log(`Done ${item.artist} - ${item.album}\n`)
                    success = true
                } catch (e) {
                    albumRetry++

                    const status = e?.response?.status

                    if (status === 429) {
                        const retryAfter = Number(e.response?.headers?.['retry-after'] || 10)

                        console.log(`429 → waiting ${retryAfter}s (retry ${albumRetry}/3)\n`)
                        await delay(retryAfter * 1000)
                        continue
                    }

                    console.log(`Failed ${item.artist} - ${item.album}: ${e.message}\n`)
                    success = true
                }
            }

            if (i < seedAlbums.length - 1) {
                console.log(`⏳ Waiting ${DELAY_BETWEEN_ALBUMS / 1000}s...\n`)
                await delay(DELAY_BETWEEN_ALBUMS)
            }
        }

        console.log("Seed finished")
        process.exit(0)

    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

run()