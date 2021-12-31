import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston'
import * as winston from 'winston'
import { LoggerService } from '@nestjs/common'
import { isProd } from '../utils/env'

export const getLogger = (): LoggerService => {
  if (isProd) {
    return WinstonModule.createLogger({
      level: 'error',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.splat(),
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        //new winston.transports.File({ filename: 'combined.log' }),
      ],
    })
  } else {
    return WinstonModule.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike()
          ),
        }),
      ],
    })
  }
}
