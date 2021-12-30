import { Controller, Get, Inject } from '@nestjs/common'
import { AppService } from './app.service'
import { MicroServiceInjectionToken } from './micro-services/micro-service.provider'
import { IMessage, MessageMQ } from './micro-services/rabbitmq/message.mq'
import { StoreRedis } from './micro-services/redis/store.redis'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(MicroServiceInjectionToken.REDIS_STORE)
    private readonly redis: StoreRedis,
    @Inject(MicroServiceInjectionToken.MQ_MESSAGE)
    private readonly mq: MessageMQ
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('redis')
  async testRedis(): Promise<{}> {
    const key = 'nest-simple-server/run-at'
    this.redis.set(key, `${new Date().valueOf()}`)
    const value = await this.redis.get(key)
    return { key, value }
  }

  @Get('mq')
  async testMQ(): Promise<{}> {
    const message: IMessage = {
      subject: 'test',
      data: { time: `${new Date().valueOf()}` },
    }
    this.mq.publish(message)
    return { publish: message }
  }
}
