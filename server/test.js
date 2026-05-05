import 'dotenv/config'
import yandexApi from './clients/yandexApi.js'
import yandexService from './services/yandexService.js'

const testTrack = async () => {
    const trackName = "I KNOW ?"
    const artistName = "Travis Scott"
    const query = `${artistName} - ${trackName}`
    
    console.log(`Поиск: ${query}`)
    console.log('---')
    
    try {
        const tracks = await yandexApi.searchTracks(query, 5)
        
        if (!tracks.length) {
            console.log('Треки не найдены')
            return
        }
        
        console.log(`Найдено треков: ${tracks.length}`)
        console.log('---')
        
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i]
            console.log(`${i + 1}. ${track.title}`)
            console.log(`   Исполнители: ${track.artists?.map(a => a.name).join(', ') || 'не указаны'}`)
            console.log(`   ID: ${track.id}`)
            console.log('---')
        }
        
        const track = tracks[0]
        const streamUrl = await yandexService.getStreamUrl(track.id)
        console.log('Stream URL первого трека:')
        console.log(streamUrl)
        
    } catch (error) {
        console.log('Ошибка:', error.message)
    }
}

testTrack()