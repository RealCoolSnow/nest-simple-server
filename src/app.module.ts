import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  RequestMethod,
} from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ComponentsModule } from './components/components.module'
import { ResponseExceptionFilter } from './common/filter/exception/response-exception.filter'
import { DatabaseModule } from './database/database.module'
import { RolesGuard } from './common/guard/roles.guard'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { ResponseTransformInterceptor } from './common/interceptor/response-transform.interceptor'
import { AppI18nModule } from './common/app-i18n.module'
import { MicroServiceProvider } from './micro-services/micro-service.provider'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ConfigModule } from '@nestjs/config'
import { isUseThrottler } from './utils/env'

const CommonProvider: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: ResponseExceptionFilter,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseTransformInterceptor,
  },
]

const _ConfigModule = ConfigModule.forRoot({
  envFilePath: [
    '.env',
    '.env.production',
    '.env.development.local',
    '.env.development',
  ],
})

const imports: any[] = [
  _ConfigModule,
  DatabaseModule,
  AppI18nModule,
  ComponentsModule,
]
if (isUseThrottler()) {
  CommonProvider.push({
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  })
  const _ThrottlerModule = ThrottlerModule.forRoot({
    ttl: Number(process.env.THROTTLER_TTL_DEFAULT),
    limit: Number(process.env.THROTTLER_LIMIT_DEFAULT),
    ignoreUserAgents: [/throttler-test/g],
  })
  imports.push(_ThrottlerModule)
}

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService, ...CommonProvider, ...MicroServiceProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET })
  }
}
