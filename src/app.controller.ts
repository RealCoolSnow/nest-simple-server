import { Controller, Get, Inject } from '@nestjs/common'
import { AppService } from './app.service'
import { MicroServiceInjectionToken } from './micro-services/micro-service.provider'
import { StoreRedis } from './micro-services/redis/store.redis'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(MicroServiceInjectionToken.REDIS_STORE)
    private readonly redis: StoreRedis
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('redis')
  async testRedis(): Promise<any> {
    const key = 'nest-simple-server/run-at'
    this.redis.set(key, `${new Date().valueOf()}`)
    const value = await this.redis.get(key)
    return { key, value }
  }
}
