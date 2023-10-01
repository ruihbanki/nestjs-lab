import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';
import { AuthClient } from 'src/auth/auth-client.decorator';
import { AuthClientDTO } from 'src/auth/auth-client.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';
import { UsersArgs } from './users.args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async users(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args() args: UsersArgs,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.findUsers(clientId, args, relations, select);
  }

  @Query(() => User)
  async user(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('userId') userId: string,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.findUserById(clientId, userId, relations, select);
  }

  @Mutation(() => User)
  async createUser(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('input') input: CreateUserInput,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.createUser(clientId, input, relations, select);
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('userId') userId: string,
  ) {
    return this.usersService.deleteUser(clientId, userId);
  }

  @Mutation(() => User)
  async updateUser(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.updateUser(clientId, id, input, relations, select);
  }
}
