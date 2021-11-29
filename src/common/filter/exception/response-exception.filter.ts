import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    const msg =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error'
    const responseBody = {
      code: -1,
      msg,
      data: {
        error: msg,
      },
      statusCode: httpStatus,
      url: httpAdapter.getRequestUrl(ctx.getRequest()),
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
