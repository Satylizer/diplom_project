import spotifyService from "./spotify/index.js"
import models from "../models/models.js"

const { Artist, Album, Song, SongArtists } = models

class SongImportService {
    async loadAlbum(artistName, albumName) {
        const mainArtist = await spotifyService.getArtistByName(artistName)
        const albumData = await spotifyService.getAlbumByName(artistName, albumName)
        const tracks = await spotifyService.getAlbumTracksByName(artistName, albumName)

        const [artist] = await Artist.findOrCreate({
            where: { spotifyId: mainArtist.spotifyId },
            defaults: {
                name: mainArtist.name,
                imgUrl: mainArtist.imgUrl,
            }
        })

        const [album] = await Album.findOrCreate({
            where: { spotifyId: albumData.spotifyId },
            defaults: {
                title: albumData.title,
                imgUrl: albumData.imgUrl,
                releaseDate: albumData.releaseDate,
                totalTracks: albumData.totalTracks,
                artistId: artist.id,
            }
        })

        for (const track of tracks) {
            const [song] = await Song.findOrCreate({
                where: { spotifyId: track.spotifyId },
                defaults: {
                    name: track.name,
                    durationMs: track.durationMs,
                    trackNumber: track.trackNumber,
                    albumId: album.id,
                    imgUrl: album.imgUrl
                }
            })
            
            for (const trackArtist of track.artists) {
                let songArtist = await Artist.findOne({ 
                    where: { spotifyId: trackArtist.spotifyId } 
                })
                
                if (!songArtist) {
                    const fullArtist = await spotifyService.getArtist(trackArtist.spotifyId)
                    songArtist = await Artist.create({
                        spotifyId: trackArtist.spotifyId,
                        name: trackArtist.name,
                        imgUrl: fullArtist.imgUrl,
                    })
                }
                
                await SongArtists.findOrCreate({
                    where: {
                        songId: song.id,
                        artistId: songArtist.id
                    }
                })
            }
        }

        return album
    }
}

export default new SongImportService()