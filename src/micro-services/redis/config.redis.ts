class RedisConfig {
  readonly host: string
  readonly port: number
}

class RedisClusterConfig {
  readonly master: RedisConfig
  readonly slave: RedisConfig
}

const getRedisClusterConfig = (): RedisClusterConfig => {
  const { REDIS_MASTER_PORT, REDIS_MASTER_HOST } = process.env
  const masterHost = REDIS_MASTER_HOST ? REDIS_MASTER_HOST : 'localhost'
  const masterPort = Number(REDIS_MASTER_PORT)
    ? Number(REDIS_MASTER_PORT)
    : 6379
  const master: RedisConfig = { host: masterHost, port: masterPort }

  const { REDIS_SLAVE_HOST, REDIS_SLAVE_PORT } = process.env
  const slaveHost = REDIS_SLAVE_HOST ? REDIS_SLAVE_HOST : 'localhost'
  const slavePort = Number(process.env.REDIS_SLAVE_PORT)
    ? Number(REDIS_SLAVE_PORT)
    : 6379
  const slave: RedisConfig = { host: slaveHost, port: slavePort }

  return { master, slave }
}

export { RedisConfig, RedisClusterConfig, getRedisClusterConfig }
