import { Injectable, Logger } from '@nestjs/common'
import { Channel, connect, Connection } from 'amqplib'
import { getRabbitMQConfig, RabbitMQConfig } from './config.mq'

export class IMessage {
  readonly subject: string
  readonly data: Record<string, string>
}

@Injectable()
export class MessageMQ {
  private static exchange: string
  private readonly promisedChannel: Promise<Channel>

  constructor() {
    const config = getRabbitMQConfig()
    MessageMQ.exchange = config.exchange
    this.promisedChannel = MessageMQ.connect(config)
  }

  async publish(message: IMessage): Promise<void> {
    this.promisedChannel.then((channel) => {
      const result = channel.publish(
        MessageMQ.exchange,
        message.subject,
        Buffer.from(JSON.stringify(message.data))
      )
      Logger.debug(`publish ${message.subject}: ${result}`)
      return result
    })
  }

  private static async connect(config: RabbitMQConfig): Promise<Channel> {
    Logger.log(
      `connect mq: ${config.username}#${config.password}@${config.hostname}`
    )
    return connect(config)
      .then(MessageMQ.createChannel)
      .then(MessageMQ.assertExchange)
      .catch((err) => {
        Logger.error(err)
        return MessageMQ.connect(config)
      })
  }

  private static async createChannel(connection: Connection): Promise<Channel> {
    return connection.createChannel()
  }

  private static async assertExchange(channel: Channel): Promise<Channel> {
    await channel.assertExchange(MessageMQ.exchange, 'topic', {
      durable: true,
    })
    return channel
  }
}
