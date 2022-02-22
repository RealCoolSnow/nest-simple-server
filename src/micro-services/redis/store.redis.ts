import { Injectable, Logger } from '@nestjs/common'
import Redis from 'ioredis'
import { getRedisClusterConfig } from './config.redis'

@Injectable()
export class StoreRedis {
  private readonly master: Redis.Redis
  private readonly slave: Redis.Redis
  constructor() {
    const { master, slave } = getRedisClusterConfig()
    this.master = new Redis({ port: master.port, host: master.host }).on(
      'error',
      this.failToConnectRedis
    )
    // this.slave = new Redis(slave.port, slave.host).on(
    //   'error',
    //   this.failToConnectRedis
    // )
  }

  async set(key: string, value: string): Promise<void> {
    await this.master.set(key, value)
  }

  async get(key: string): Promise<string | null> {
    return this.master
      .get(key)
      .then((result) => result)
      .catch(() => null)
  }

  private failToConnectRedis(error: Error): Promise<void> {
    Logger.error(`Fail to connect Redis: ${error}`)
    process.exit(1)
  }
}
