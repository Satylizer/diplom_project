// server/services/recommendations/config/mlPlaylistConfig.js
export const ML_PLAYLIST_CONFIG = {
    titles: {
        sequence: [
            'Based on your history',
            'You might also like',
            'Discovered for you',
            'Deep cuts',
            'Back to your roots'
        ],
        same_energy: [
            'Similar vibe',
            'Same energy, different artist',
            'Higher energy',
            'Lower energy',
            'Recent similar'
        ]
    },
    img: {
        sequence: [
            '/ml_recs/sequence_1.jpg',
            '/ml_recs/sequence_2.jpg',
            '/ml_recs/sequence_3.jpg',
            '/ml_recs/sequence_4.jpg',
            '/ml_recs/sequence_5.jpg'
        ],
        same_energy: [
            '/ml_recs/energy_1.jpg',
            '/ml_recs/energy_2.jpg',
            '/ml_recs/energy_3.jpg',
            '/ml_recs/energy_4.jpg',
            '/ml_recs/energy_5.jpg'
        ]
    }
}