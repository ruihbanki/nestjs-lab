import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';
import { FindUsersArgs } from './find-users.args';
import { Relations } from 'src/utils/relations.decorator';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { Select } from 'src/utils/select.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  async findUserById(@Args('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Query(() => [User])
  async findUsers(
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
    @Args() args?: FindUsersArgs,
  ) {
    const { withDeleted } = args;
    console.log(select);

    return this.usersService.findUsers({ withDeleted, relations, select });
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.createUser(input);
  }

  @Mutation(() => User)
  async createClientUser(
    @Args('clientId') clientId: string,
    @Args('input') input: CreateUserInput,
  ) {
    return this.usersService.createClientUser(clientId, input);
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

  @ResolveField()
  fullName(@Parent() user: User) {
    return `${user.firstName} ${user.lastName}`;
  }
}
