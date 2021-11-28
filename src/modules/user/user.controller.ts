import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { Roles } from 'src/modules/common/decorator/roles.decorator'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserValidationPipe } from './pipe/user-validation.pipe'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body(UserValidationPipe) createUserDto: CreateUserDto) {
    this.userService.create(createUserDto)
    return 'OK'
  }

  @Get()
  @Roles('admin')
  async findAll() {
    // throw new BadGatewayException()
    return this.userService.findAll()
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return `id = ${id}`
  }
}
