import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';

interface FindOptions {
  relations?: FindOptionsRelations<User>;
  select?: FindOptionsSelect<User>;
}

interface FindUsersOptions extends FindOptions {
  withDeleted?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findUsers(options: FindUsersOptions = {}): Promise<User[]> {
    const { relations, select, withDeleted } = options;
    return this.usersRepository.find({
      relations,
      select,
      withDeleted,
    });
  }

  findUserById(
    userId: string,
    options: FindOptions = {},
  ): Promise<User | null> {
    const { select, relations } = options;
    return this.usersRepository.findOne({
      where: { userId },
      relations,
      select,
    });
  }

  findUserByUsername(
    username: string,
    options: FindOptions = {},
  ): Promise<User | null> {
    const { select, relations } = options;
    return this.usersRepository.findOne({
      where: { username },
      relations,
      select,
    });
  }

  associateUser(clientId: string, userId: string) {
    console.log(clientId, userId);
  }

  async createSuperUser(input: CreateUserInput): Promise<User> {
    const user = {
      ...input,
      isSuper: true,
    };
    return await this.usersRepository.save(user);
  }

  async createUser(clientId: string, input: CreateUserInput): Promise<User> {
    const user = {
      ...input,
      clients: [
        {
          clientId,
        },
      ],
    };
    return await this.usersRepository.save(user);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.usersRepository.softDelete(id);
    console.log(result);

    return result.affected > 0;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result.affected > 0;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<void> {
    const result = await this.usersRepository.update(id, input);
    if (result.affected === 0) {
      throw new NotFoundException(`User with the id '${id}' was not found.`);
    }
  }
}
