import {
  Body,
  Controller,
  BadGatewayException,
  Get,
  Post,
  Param,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common'
import { ValidationPipe } from 'src/common/pipe/validation.pipe'
import { CatService } from './cat.service'
import { CreateCatDto } from './dto/create-cat.dto'

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catService.create(createCatDto)
  }

  @Get()
  async findAll() {
    throw new BadGatewayException()
    //return this.catService.findAll()
  }

  @Get(':id')
  async findOne(
    @Param('id', ValidationPipe)
    id: number
  ) {
    return `id = ${id}`
  }
}
