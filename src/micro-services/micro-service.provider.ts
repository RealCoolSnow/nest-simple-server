import { Provider } from '@nestjs/common'
import { MessageMQ } from './rabbitmq/message.mq'
import { StoreRedis } from './redis/store.redis'

export enum MicroServiceInjectionToken {
  REDIS_STORE = 'Redis-Store',
  MQ_MESSAGE = 'MQ-Message',
}

export const MicroServiceProvider: Provider[] = [
  {
    provide: MicroServiceInjectionToken.REDIS_STORE,
    useClass: StoreRedis,
  },
  {
    provide: MicroServiceInjectionToken.MQ_MESSAGE,
    useClass: MessageMQ,
  },
]
