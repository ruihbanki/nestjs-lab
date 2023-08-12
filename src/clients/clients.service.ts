import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsRelations,
  FindOptionsSelect,
  Repository,
} from 'typeorm';

import { Client } from './client.entity';
import { CreateClientInput } from './create-client.input';
import { UpdateClientInput } from './update-client.input';
import { ClientContact } from 'src/client-contacts/client-contact.entity';

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
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
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
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        // get repositories
        const clientsRepository =
          transactionalEntityManager.getRepository(Client);
        const clientContactsRepository =
          transactionalEntityManager.getRepository(ClientContact);

        // delete client contacts
        clientContactsRepository.delete({ client: { clientId } });

        // update client without passing the contacts
        const inputWithoutContacts = {
          ...input,
          contacts: undefined,
        };
        clientsRepository.update(clientId, inputWithoutContacts);

        // insert new contacts
        const clientContacts = input.contacts.map((c) => ({
          ...c,
          client: {
            clientId,
          },
        }));
        clientContactsRepository.save(clientContacts);

        // return the entity
        return clientsRepository.findOne({
          where: { clientId },
          relations: options.relations,
          select: options.select,
        });
      },
    );
  }
}
