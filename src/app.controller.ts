import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { StoreRedis } from './micro-services/redis/store.redis'

@Controller()
export class AppController {
  private readonly redis: StoreRedis
  constructor(private readonly appService: AppService) {
    this.redis = new StoreRedis()
  }

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
