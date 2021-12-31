import { Injectable, Logger } from '@nestjs/common'
import { Channel, connect, Connection, ConsumeMessage } from 'amqplib'
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
      Logger.debug(
        `publish ${MessageMQ.exchange} ${message.subject}: ${result}`
      )
      return result
    })
  }

  async queue(queue: string, message: IMessage): Promise<void> {
    this.promisedChannel.then((channel) => {
      channel.assertQueue(queue, { durable: false }).then(() => {
        const data = JSON.stringify(message.data)
        const result = channel.sendToQueue(queue, Buffer.from(data))
        const log = `queue ${queue} ${data}: ${result}`
        if (result) {
          Logger.debug(log)
        } else {
          Logger.error(log)
        }
      })
    })
  }

  async consume(queue: string): Promise<any> {
    this.promisedChannel
      .then((channel) => {
        channel
          .assertQueue(queue, { durable: false })
          .then(() => {
            channel
              .consume(
                queue,
                (message: ConsumeMessage) => {
                  Logger.debug(message)
                  Promise.resolve(message)
                }
                // { noAck: true }
              )
              .catch((error) => {
                Promise.reject(error)
              })
          })
          .catch((error) => {
            Promise.reject(error)
          })
      })
      .catch((error) => {
        Promise.reject(error)
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
        //return MessageMQ.connect(config)
        return Promise.reject(err)
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
