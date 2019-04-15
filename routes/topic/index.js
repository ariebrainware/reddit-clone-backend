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

router.get('/', (req, res, next) => {
    redis.hgetall('post',(err, result) => {
        if(err) res.status(500).send({message: err})
        res.status(200).send(result)
      })
})

router.post('/add', async (req, res, next) => {
  const { text, upvotes } = req.body
  const response =  await redis.hmset('post', { key: uuid(), text, upvotes })
  if(!response) res.status(500).send({message: 'Input error'})
  res.status(200).send(response)
})

module.exports = router