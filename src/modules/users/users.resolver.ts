import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';
import { FindUsersArgs } from './find-users.args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  async findUserById(@Args('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Query(() => [User])
  async users(
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
    @Args() args?: FindUsersArgs,
  ) {
    const { withDeleted } = args;
    return this.usersService.findUsers({ withDeleted, relations, select });
  }

  @Mutation(() => User)
  async createUser(
    @Args('clientId') clientId: string,
    @Args('input') input: CreateUserInput,
  ) {
    return this.usersService.createUser(clientId, input);
  }

  @Mutation(() => User)
  async createSuperUser(@Args('input') input: CreateUserInput) {
    return this.usersService.createSuperUser(input);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ) {
    await this.usersService.updateUser(id, input);
    return this.usersService.findUserById(id);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Mutation(() => Boolean)
  async softDeleteUser(@Args('id') id: string) {
    return this.usersService.softDelete(id);
  }

  @Mutation(() => Boolean)
  async associateUser(
    @Args('clientId') clientId: string,
    @Args('userId') userId: string,
  ) {
    return this.usersService.associateUser(clientId, userId);
  }
}
