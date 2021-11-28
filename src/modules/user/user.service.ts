import { Injectable } from '@nestjs/common'
import { User } from './interface/user.interface'

@Injectable()
export class UserService {
  private readonly users: User[] = []
  create(user: User): void {
    this.users.push(user)
  }
  findAll(): User[] {
    return this.users
  }
}
