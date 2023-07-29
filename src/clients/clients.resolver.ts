import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { Client } from './client.entity';
import { CreateClientInput } from './create-client.input';
import { UpdateClientInput } from './update-client.input';

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private clientsService: ClientsService) {}

  @Query(() => Client)
  async findClientById(@Args('id') id: string) {
    return this.clientsService.findClientById(id);
  }

  @Query(() => [Client])
  async findClients() {
    return this.clientsService.findClients();
  }

  @Mutation(() => Client)
  async createClient(@Args('input') input: CreateClientInput) {
    return this.clientsService.createClient(input);
  }

  @Mutation(() => Boolean)
  async removeClient(@Args('id') id: string) {
    return this.clientsService.removeClient(id);
  }

  @Mutation(() => Client)
  async updateClient(
    @Args('id') id: string,
    @Args('input') input: UpdateClientInput,
  ) {
    await this.clientsService.updateClient(id, input);
    return this.clientsService.findClientById(id);
  }
}
