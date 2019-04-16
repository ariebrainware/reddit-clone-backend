const router = require('express').Router()
const Redis = require('redis')
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
  ? Redis.createClient({
      password: process.env.DBPASS,
      host: process.env.DBHOST,
      port: process.env.DBPORT,
      db: process.env.DBNAME
  }) : Redis.createClient()

router.get('/', async (req, res) => {
  redis.lrange('topic', 0, -1, (err, result) => {
    if(err) res.status(500).send(err)
    res.status(200).send({
      text: result
    })
  })
})

router.post('/add', async (req, res) => {
  const { text, upvotes } = req.body
  redis.rpush('topic', text, upvotes, (err, result) => {
    if(err) res.status(500).send(err)
    res.status(200).send({ message: 'Post saved!!'})
  })
})

module.exports = router