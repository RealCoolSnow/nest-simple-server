import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { getClientIp } from 'request-ip'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = getClientIp(req)
    Logger.log(`Request: ${clientIp} ${req.headers['user-agent']}`)
    next()
  }
}
