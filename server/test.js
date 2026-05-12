// server/testMlService.js
import 'dotenv/config'
import sequelize from './db.js'
import MlPlaylistService from './services/recommendations/mlPlaylistService.js'

const testMlService = async () => {
    try {
        await sequelize.authenticate()
        console.log('DB connected\n')

        const service = MlPlaylistService
        const userId = 1
        const top_k = 100

        console.log('1. Testing _fetchRecommendations...')
        const recs = await service._fetchRecommendations(userId, top_k)
        
        console.log('   sequence count:', recs.sequence.length)
        console.log('   sameEnergy count:', recs.sameEnergy.length)
        
        if (recs.sequence.length > 0) {
            console.log('   first sequence item:', JSON.stringify(recs.sequence[0], null, 2))
        }
        
        if (recs.sameEnergy.length > 0) {
            console.log('   first sameEnergy item:', JSON.stringify(recs.sameEnergy[0], null, 2))
        }
        console.log('')

        console.log('2. Testing _buildRecs...')
        const { sequence, sameEnergy } = await service._buildRecs(userId, top_k)
        
        console.log('   sequence songs:', sequence.length)
        console.log('   sameEnergy songs:', sameEnergy.length)
        
        if (sequence.length > 0) {
            console.log('   first sequence song:', {
                id: sequence[0].id,
                name: sequence[0].name,
                hasArtists: !!sequence[0].artists,
                hasAlbum: !!sequence[0].album
            })
        }
        
        if (sameEnergy.length > 0) {
            console.log('   first sameEnergy song:', {
                id: sameEnergy[0].id,
                name: sameEnergy[0].name,
                hasArtists: !!sameEnergy[0].artists,
                hasAlbum: !!sameEnergy[0].album
            })
        }
        console.log('')

        console.log('3. Testing _splitIntoSections...')
        const sequenceSections = service._splitIntoSections(sequence, 5)
        const energySections = service._splitIntoSections(sameEnergy, 5)
        
        console.log('   sequence sections:', sequenceSections.length)
        console.log('   energy sections:', energySections.length)
        
        sequenceSections.forEach((section, i) => {
            console.log(`   section ${i + 1} (sequence):`, section.length, 'songs')
            if (section.length > 0) {
                console.log(`     first song:`, section[0].name)
            }
        })
        
        energySections.forEach((section, i) => {
            console.log(`   section ${i + 1} (energy):`, section.length, 'songs')
            if (section.length > 0) {
                console.log(`     first song:`, section[0].name)
            }
        })
        
        console.log('\n✅ ALL TESTS PASSED')

    } catch (error) {
        console.error('❌ TEST FAILED')
        console.error('Error:', error.message)
        console.error('Stack:', error.stack)
    } finally {
        await sequelize.close()
    }
}

testMlService()