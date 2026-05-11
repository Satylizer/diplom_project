import 'dotenv/config'
import sequelize from './db.js'
import { train } from './services/recommendations/trainTwoTower.js'

async function test() {
  try {
    console.log('🔌 DB connecting...')
    await sequelize.authenticate()
    console.log('✅ DB connected')

    console.log('🚀 Starting training test...')

    await train()

    console.log('✅ TRAIN TEST PASSED')
  } catch (err) {
    console.error('❌ TRAIN TEST FAILED')
    console.error(err)
  } finally {
    await sequelize.close()
  }
}

test()