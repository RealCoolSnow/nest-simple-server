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
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseTransformInterceptor,
  },
]
// 10 requests from the same IP can be made to a single endpoint in 3 seconds.
const _ThrottlerModule = ThrottlerModule.forRoot({
  ttl: 3,
  limit: 10,
  ignoreUserAgents: [/throttler-test/g],
})

@Module({
  imports: [DatabaseModule, AppI18nModule, _ThrottlerModule, ComponentsModule],
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
