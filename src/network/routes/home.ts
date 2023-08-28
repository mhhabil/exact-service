import { Response, Request, Router } from 'express'
const apm = require('elastic-apm-node')

import { response } from 'network/response'
import { ElasticLoggerService } from './emr/services'

const Home = Router()

Home.route('').get((req: Request, res: Response) => {
  try {
    ElasticLoggerService().createLog(req, "/emr/home/", "OK");
  } catch (e) {
    console.error(e)
  } finally {
    response({
      error: false,
      message: 'Welcome to your Express Backend!',
      res,
      status: 200,
    })
  }
})

export { Home }
