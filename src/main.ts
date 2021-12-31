import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { getLogger } from './common/logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogger(),
  })
  //app.enableCors()
  await app.listen(process.env.PORT || 3000)
  Logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
