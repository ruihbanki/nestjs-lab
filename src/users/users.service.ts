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

  async findUserById(
    clientId: string,
    userId: string,
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { userId, client: { clientId } },
      relations,
      select,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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
      client: {
        clientId,
      },
    };
    const result = await this.usersRepository.save(user);
    return this.findUserById(clientId, result.userId, relations, select);
  }

  async updateUser(
    clientId: string,
    userId: string,
    input: UpdateUserInput,
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<User> {
    await this.usersRepository.update(
      {
        userId,
        client: {
          clientId,
        },
      },
      input,
    );
    return this.findUserById(clientId, userId, relations, select);
  }

  async deleteUser(clientId: string, userId: string): Promise<User> {
    const user = await this.findUserById(clientId, userId);
    await this.usersRepository.softDelete(userId);
    return user;
  }
}
