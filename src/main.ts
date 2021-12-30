import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston'
import * as winston from 'winston'
import { Logger, LoggerService } from '@nestjs/common'
import { isProd } from './utils/env'

const getLogger = (): LoggerService => {
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
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogger(),
  })
  //app.enableCors()
  await app.listen(process.env.PORT || 3000)
  Logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
