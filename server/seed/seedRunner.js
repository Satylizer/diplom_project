import 'dotenv/config'
import sequelize from "../db.js"
import seedAlbums from "./seedAlbums.js"
import SongImportService from "../services/SongImportService.js"

const run = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        console.log("Starting seed...\n")

        for (const item of seedAlbums) {
            console.log(`Loading ${item.artist} - ${item.album}`)

            try {
                await SongImportService.loadAlbum(item.artist, item.album)
                console.log(`Done ${item.artist} - ${item.album}\n`)
            } catch (e) {
                console.log(`Failed ${item.artist} - ${item.album}: ${e.message}\n`)
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