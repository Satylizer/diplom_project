import yandexApi from '../clients/yandexApi.js';
import ApiError from '../error/ApiError.js';
import { fetchDownloadXml, generateDirectUrl, cleanTrackName } from './yandexUtils.js';

class YandexService {
    async findTrackId(query, expectedArtists) {
        
        const tracks = await yandexApi.searchTracks(query, 5)
        
        if (!tracks.length) {
            throw ApiError.notFound('Трек не найден')
        }
        
        const expectedList = expectedArtists.map(a => a.toLowerCase())
        
        for (const track of tracks) {
            const artists = track.artists || []
            const yandexArtists = artists.map(a => a.name.toLowerCase())

            const allValid = yandexArtists.every(ya => 
                expectedList.some(e => ya === e || ya.includes(e) || e.includes(ya))
            )
            
            if (allValid) {
                return track.id
            }
        }
        
        throw ApiError.notFound(`Трек не найден`)
    }

    async getStreamUrl(trackId) {
        console.log(`[getStreamUrl] Получение URL для trackId: ${trackId}`);
        
        const downloadInfoList = await yandexApi.getDownloadInfo(trackId)

        
        if (!downloadInfoList?.length) {
            console.log(`[getStreamUrl] Информация не найдена`);
            throw ApiError.notFound('Информация для загрузки не найдена')
        }
        
        const bestQuality = downloadInfoList.find(
            info => info.codec === 'mp3' && info.bitrateInKbps === 320
        ) || downloadInfoList.find(info => info.codec === 'mp3') || downloadInfoList[0]
        
        console.log(`[getStreamUrl] Выбран: кодек=${bestQuality.codec}, битрейт=${bestQuality.bitrateInKbps || '?'} kbps`);
        
        if (!bestQuality.downloadInfoUrl) {
            console.log(`[getStreamUrl] Нет ссылки на XML`);
            throw ApiError.notFound('Ссылка на XML не найдена')
        }
        
        const xmlData = await fetchDownloadXml(bestQuality.downloadInfoUrl)
        const directUrl = generateDirectUrl(xmlData)
        
        console.log(`[getStreamUrl] URL получен`);
        return directUrl
    }

    async getStreamUrlByQuery(trackName, artistName) {
        console.log(`[getStreamUrlByQuery] Вход: trackName=${trackName}, artistName=${artistName}`);
        
        const cleanedTrackName = cleanTrackName(trackName)
        console.log(`[getStreamUrlByQuery] cleanedTrackName: ${cleanedTrackName}`);
        
        const query = `${cleanedTrackName} - ${artistName[0]}`
        console.log(`[getStreamUrlByQuery] Запрос: ${query}`);
        
        const trackId = await this.findTrackId(query, artistName)
        console.log(`[getStreamUrlByQuery] Получен trackId: ${trackId}`);
        
        const streamUrl = await this.getStreamUrl(trackId)
        console.log(`[getStreamUrlByQuery] Готово`);
        
        return streamUrl
    }
}

export default new YandexService()