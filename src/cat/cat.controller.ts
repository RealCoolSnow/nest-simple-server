import {
  Body,
  Controller,
  BadGatewayException,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { CatService } from './cat.service'
import { CreateCatDto } from './dto/create-cat.dto'
import { CatValidationPipe } from './pipe/cat-validation.pipe'

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post()
  async create(@Body(CatValidationPipe) createCatDto: CreateCatDto) {
    this.catService.create(createCatDto)
    return 'OK'
  }

  @Get()
  async findAll() {
    throw new BadGatewayException()
    //return this.catService.findAll()
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return `id = ${id}`
  }
}
