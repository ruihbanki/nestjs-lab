import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';

interface FindUsersOptions {
  withDeleted?: boolean;
  relations?: FindOptionsRelations<User>;
  select?: FindOptionsSelect<User>;
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

  findUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: { clients: true },
    });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    return await this.usersRepository.save(input);
  }

  async createClientUser(
    clientId: string,
    input: CreateUserInput,
  ): Promise<User> {
    const user = {
      ...input,
      clients: [
        {
          id: clientId,
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
