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
    @Args('userId') userId: string,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.findUserById(userId, relations, select);
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

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.updateUser(id, input, relations, select);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Mutation(() => Boolean)
  async softDeleteUser(@Args('id') id: string) {
    return this.usersService.softDelete(id);
  }
}
