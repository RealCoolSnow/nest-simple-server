import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatModule } from './cat/cat.module'
import { AllExceptionFilter } from './common/filter/exception/all-exception.filter'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { RolesGuard } from './common/guard/roles.guard'
import { LoggingInterceptor } from './common/interceptor/logging.interceptor'

@Module({
  imports: [CatModule],
  controllers: [AppController],
  providers: [
    AppService,
    /*
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },*/
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    /*
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },*/
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cat', method: RequestMethod.GET })
  }
}