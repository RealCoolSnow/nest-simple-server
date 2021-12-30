class RabbitMQConfig {
  readonly exchange: string
  readonly hostname: string
  readonly username: string
  readonly password: string
}

const getRabbitMQConfig = (): RabbitMQConfig => {
  return {
    exchange: process.env.RABBIT_MQ_EXCHANGE || 'nest-simple-server',
    hostname: process.env.RABBIT_MQ_HOSTNAME || 'localhost',
    username: process.env.RABBIT_MQ_USER_NAME || 'root',
    password: process.env.RABBIT_MQ_PASSWORD || '123456',
  }
}

export { RabbitMQConfig, getRabbitMQConfig }
