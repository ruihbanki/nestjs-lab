import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';
import { UsersArgs } from './users.args';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findUsers(
    clientId: string,
    options: UsersArgs = {},
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<User[]> {
    return this.usersRepository.find({
      where: {
        client: { clientId },
      },
      relations,
      select,
      withDeleted: options.withDeleted,
    });
  }

  findUserById(
    userId: string,
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { userId },
      relations,
      select,
    });
  }

  findUserByUsername(
    clientId: string,
    username: string,
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username, client: { clientId } },
      relations,
      select,
    });
  }

  async createUser(
    clientId: string,
    input: CreateUserInput,
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<User> {
    const user = {
      ...input,
      clients: [
        {
          clientId,
        },
      ],
    };
    const result = await this.usersRepository.save(user);
    return this.findUserById(result.userId, relations, select);
  }

  async updateUser(
    userId: string,
    input: UpdateUserInput,
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<User> {
    const result = await this.usersRepository.update(userId, input);
    if (result.affected === 0) {
      throw new NotFoundException(
        `User with the id '${userId}' was not found.`,
      );
    }
    return this.findUserById(userId, relations, select);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.usersRepository.softDelete(id);
    return result.affected > 0;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result.affected > 0;
  }
}
