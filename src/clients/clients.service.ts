import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { ClientContact } from 'src/client-contacts/client-contact.entity';
import { Client } from './client.entity';
import { CreateClientInput } from './create-client.input';
import { UpdateClientInput } from './update-client.input';

interface FindOptions {
  relations?: FindOptionsRelations<Client>;
  select?: FindOptionsSelect<Client>;
}

interface FindClientsOptions extends FindOptions {
  withDeleted?: boolean;
}

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(ClientContact)
    private clientContactRepository: Repository<ClientContact>,
  ) {}

  async findClients(options: FindClientsOptions = {}): Promise<Client[]> {
    const { relations, select, withDeleted } = options;
    return this.clientsRepository.find({
      relations,
      select,
      withDeleted,
    });
  }

  async findClientById(
    clientId: string,
    options: FindOptions = {},
  ): Promise<Client | null> {
    const { relations, select } = options;
    return this.clientsRepository.findOne({
      where: { clientId },
      relations: relations,
      select: select,
    });
  }

  async createClient(
    input: CreateClientInput,
    options: FindOptions = {},
  ): Promise<Client> {
    const client = await this.clientsRepository.save(input);
    return this.findClientById(client.clientId, options);
  }

  async deleteClient(clientId: string): Promise<boolean> {
    const result = await this.clientsRepository.delete(clientId);
    return result.affected > 0;
  }

  async updateClient(
    clientId: string,
    input: UpdateClientInput,
    options: FindOptions = {},
  ): Promise<Client> {
    const result = await this.clientsRepository.update(clientId, input);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Client with the id '${clientId}' was not found.`,
      );
    }
    return this.findClientById(clientId, options);
  }
}
