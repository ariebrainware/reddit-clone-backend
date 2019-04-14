const router = require('express').Router()
const Redis = require('ioredis')

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
console.log(env)
const redis = env !== 'development' 
  ? new Redis({
    password: process.env.DBPASS,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    db: 0
  }) : new Redis()

router.get('/', (req, res, next) => {
    redis.get('post', (err, result) => {
        if(err) res.status(500).send({message: err})
        res.status(200).send({
            text: result,
            env: process.env.NODE_ENV
        })
    })
})

router.post('/add', async (req, res, next) => {
    const { text } = req.body
    const response =  await redis.set('post', text)
    if(response) res.status(200).send(response)
})

module.exports = router