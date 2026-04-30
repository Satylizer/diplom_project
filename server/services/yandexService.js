import yandexApi from '../clients/yandexApi.js';
import ApiError from '../error/ApiError.js';
import { fetchDownloadXml, generateDirectUrl } from './yandexUtils.js';

class YandexService {
    async findTrackId(query) {
        const tracks = await yandexApi.searchTracks(query, 1)
        
        if (!tracks.length) {
            throw ApiError.notFound('Трек не найден')
        }
        
        return tracks[0].id
    }

    async getStreamUrl(trackId) {
        const downloadInfoList = await yandexApi.getDownloadInfo(trackId)
        
        if (!downloadInfoList?.length) {
            throw ApiError.notFound('Информация для загрузки не найдена')
        }
        
        const bestQuality = downloadInfoList.find(
            info => info.codec === 'mp3' && info.bitrateInKbps === 320
        ) || downloadInfoList.find(info => info.codec === 'mp3') || downloadInfoList[0]
        
        if (!bestQuality.downloadInfoUrl) {
            throw ApiError.notFound('Ссылка на XML не найдена')
        }
        
        const xmlData = await fetchDownloadXml(bestQuality.downloadInfoUrl)
        return generateDirectUrl(xmlData)
    }

    async getStreamUrlByQuery(trackName, artistName) {
        const query = `${artistName} - ${trackName}`
        const trackId = await this.findTrackId(query)
        return this.getStreamUrl(trackId)
    }
}

export default new YandexService()