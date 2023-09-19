import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';
import { ClientsService } from './clients.service';
import { Client } from './client.entity';
import { CreateClientInput } from './create-client.input';
import { UpdateClientInput } from './update-client.input';
import { ClientReport } from './client-report.dto';

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private clientsService: ClientsService) {}

  @Query(() => Client)
  async client(
    @Args('clientId') clientId: string,
    @Relations() relations: FindOptionsRelations<Client>,
    @Select() select: FindOptionsSelect<Client>,
  ) {
    return this.clientsService.findClientById(clientId, relations, select);
  }

  @Query(() => [Client])
  async clients(
    @Relations() relations: FindOptionsRelations<Client>,
    @Select() select: FindOptionsSelect<Client>,
  ) {
    return this.clientsService.findClients(relations, select);
  }

  @Mutation(() => Client)
  async createClient(
    @Args('input') input: CreateClientInput,
    @Relations() relations: FindOptionsRelations<Client>,
    @Select() select: FindOptionsSelect<Client>,
  ) {
    return this.clientsService.createClient(input, relations, select);
  }

  @Mutation(() => Boolean)
  async deleteClient(@Args('clientId') clientId: string) {
    return this.clientsService.deleteClient(clientId);
  }

  @Mutation(() => Client)
  async updateClient(
    @Args('clientId') clientId: string,
    @Args('input') input: UpdateClientInput,
    @Relations() relations: FindOptionsRelations<Client>,
    @Select() select: FindOptionsSelect<Client>,
  ) {
    return this.clientsService.updateClient(clientId, input, relations, select);
  }

  @Query(() => [ClientReport])
  async clientsReportView() {
    return this.clientsService.viewClientsReport();
  }
}
