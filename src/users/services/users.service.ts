import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/User';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
  ) {}

  async findOne(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findByFullName(firstName: string, lastName: string): Promise<User> {
    return this.userRepository.findOne({ where: { first_name: firstName, last_name: lastName } });
  }

  async createOne({ first_name, last_name }: Partial<User>): Promise<User> {
    const id = uuidv4();
    const newUser = this.userRepository.create({ id, first_name, last_name });
    return await this.userRepository.save(newUser);
  }
}
