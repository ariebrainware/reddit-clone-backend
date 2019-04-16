const router = require('express').Router()
const Redis = require('ioredis')
const uuid = require('uuid/v4')

require('dotenv-extended').load({
  encoding: 'utf8',
  silent: true,
  path: '.env',
  defaults: '.env.defaults',
  schema: '.env.schema',
  errorOnMissing: false,
  errorOnExtra: false,
  errorOnRegex: false,
  includeProcessEnv: false,
  assignToProcessEnv: true,
  overrideProcessEnv: false
})

const env = process.env.NODE_ENV || 'development'
const redis = env !== 'development' 
  ? new Redis({
    password: process.env.DBPASS,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    db: 0
  }) : new Redis()

router.get('/', async (req, res) => {
  try {
    const response = await redis.lrange('topic', 0, -1)
    const result = response.map(data => {
      return JSON.parse(data)
    })
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.post('/add', async (req, res) => {

  try {
    const data = {
      text: req.body.text,
      upvotes: req.body.upvotes,
    }

    await redis.rpush('topic', JSON.stringify(data))
    res.status(200).send({ message: 'Post saved!!'})
  } catch(err) {
    res.status(500).send(err)
  }
})

module.exports = router