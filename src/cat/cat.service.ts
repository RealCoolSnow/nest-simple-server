import { Injectable } from '@nestjs/common'
import { Cat } from './interface/cat.interface'

@Injectable()
export class CatService {
  private readonly cats: Cat[] = []
  create(cat: Cat): void {
    this.cats.push(cat)
  }
  findAll(): Cat[] {
    return this.cats
  }
}
