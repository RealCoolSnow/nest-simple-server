import { Logger, Module } from '@nestjs/common'
import { Connection, getConnectionOptions } from 'typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { isProd } from '../utils/env'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(
          await getConnectionOptions(
            isProd ? 'prod' : 'dev'
          )
        ),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  constructor(connection: Connection) {
    if (connection.isConnected) Logger.log('DB Connected Successfully!')
  }
}
