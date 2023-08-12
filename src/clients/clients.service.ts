import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { Client } from './client.entity';
import { CreateClientInput } from './create-client.input';
import { UpdateClientInput } from './update-client.input';

interface FindClientsOptions {
  withDeleted?: boolean;
  relations?: FindOptionsRelations<Client>;
  select?: FindOptionsSelect<Client>;
}

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  findClients(options: FindClientsOptions = {}): Promise<Client[]> {
    const { relations, select, withDeleted } = options;
    return this.clientsRepository.find({
      relations,
      select,
      withDeleted,
    });
  }

  findClientById(clientId: string): Promise<Client | null> {
    return this.clientsRepository.findOneBy({ clientId });
  }

  async createClient(client: CreateClientInput): Promise<Client> {
    return await this.clientsRepository.save(client);
  }

  async removeClient(clientId: string): Promise<boolean> {
    const result = await this.clientsRepository.delete(clientId);
    return result.affected > 0;
  }

  async updateClient(
    clientId: string,
    input: UpdateClientInput,
  ): Promise<void> {
    const result = await this.clientsRepository.update(clientId, input);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Client with the id '${clientId}' was not found.`,
      );
    }
  }
}
