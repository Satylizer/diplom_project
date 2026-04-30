import crypto from 'crypto';
import ApiError from '../error/ApiError.js';

const SECRET = process.env.YANDEX_SECRET_SALT

export async function fetchDownloadXml(xmlUrl) {
    const response = await fetch(xmlUrl)
    const xml = await response.text()
    
    const host = xml.match(/<host>(.*?)<\/host>/)?.[1]
    const path = xml.match(/<path>(.*?)<\/path>/)?.[1]
    const ts = xml.match(/<ts>(.*?)<\/ts>/)?.[1]
    const s = xml.match(/<s>(.*?)<\/s>/)?.[1]
    
    if (!host || !path || !ts || !s) {
        throw ApiError.internal('Не удалось распарсить XML')
    }
    
    return { host, path, ts, s }
}

export function generateDirectUrl({ host, path, ts, s }) {
    const pathForSign = path.slice(1);
    const sign = crypto
        .createHash('md5')
        .update(SECRET + pathForSign + s)
        .digest('hex')
    
    return `https://${host}/get-mp3/${sign}/${ts}${path}`
}