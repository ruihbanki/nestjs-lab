import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';

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
  async findClients(
    @Relations() relations: FindOptionsRelations<Client>,
    @Select() select: FindOptionsSelect<Client>,
  ) {
    return this.clientsService.findClients({ select, relations });
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
