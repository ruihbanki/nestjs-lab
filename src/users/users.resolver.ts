import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';
import { UsersArgs } from './users.args';
import { AuthPayload } from '../auth/auth-payload.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async users(
    @AuthPayload('clientId') clientId: string,
    @Args() args: UsersArgs,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.findUsers(clientId, args, relations, select);
  }

  @Query(() => User)
  async user(
    @AuthPayload('clientId') clientId: string,
    @Args('userId') userId: string,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.findUserById(clientId, userId, relations, select);
  }

  @Mutation(() => User)
  async createUser(
    @AuthPayload('clientId') clientId: string,
    @Args('input') input: CreateUserInput,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.createUser(clientId, input, relations, select);
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @AuthPayload('clientId') clientId: string,
    @Args('userId') userId: string,
  ) {
    return this.usersService.deleteUser(clientId, userId);
  }

  @Mutation(() => User)
  async updateUser(
    @AuthPayload('clientId') clientId: string,
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.updateUser(clientId, id, input, relations, select);
  }
}
