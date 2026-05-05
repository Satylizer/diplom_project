import { exec } from 'child_process';
import { promisify } from 'util';
import ApiError from '../error/ApiError.js';

const execAsync = promisify(exec);

class YouTubeService {
    async getStreamUrlByQuery(trackName, artistName) {
        const query = `${artistName} - ${trackName}`;
        const command = `yt-dlp -f bestaudio --get-url "ytsearch1:${query}"`;
        
        try {
            const { stdout, stderr } = await execAsync(command);
            
            if (stderr && !stderr.includes('WARNING')) {
                console.warn('yt-dlp warning:', stderr);
            }
            
            const url = stdout.trim();
            
            if (url && url.startsWith('http')) {
                console.log(`Got stream URL (${url.length} chars)`);
                return url;
            }
            
            throw new Error('No valid URL returned');
        } catch (e) {
            throw ApiError.notFound(`Трек "${trackName} - ${artistName}" не найден на YouTube`);
        }
    }
}

export default new YouTubeService();