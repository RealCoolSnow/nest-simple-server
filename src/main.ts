import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston'
import * as winston from 'winston'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
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
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
  })
  //app.enableCors()
  await app.listen(process.env.PORT || 3000)
  Logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
