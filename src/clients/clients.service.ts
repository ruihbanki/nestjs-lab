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
import { ClientReport } from './client-report.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async findClients(
    relations?: FindOptionsRelations<Client>,
    select?: FindOptionsSelect<Client>,
  ): Promise<Client[]> {
    return this.clientsRepository.find({
      relations,
      select,
    });
  }

  async findClientById(
    clientId: string,
    relations?: FindOptionsRelations<Client>,
    select?: FindOptionsSelect<Client>,
  ): Promise<Client | null> {
    return this.clientsRepository.findOne({
      where: { clientId },
      relations: relations,
      select: select,
    });
  }

  async createClient(
    input: CreateClientInput,
    relations?: FindOptionsRelations<Client>,
    select?: FindOptionsSelect<Client>,
  ): Promise<Client> {
    const client = await this.clientsRepository.save(input);
    return this.findClientById(client.clientId, relations, select);
  }

  async deleteClient(
    clientId: string,
    relations?: FindOptionsRelations<Client>,
    select?: FindOptionsSelect<Client>,
  ): Promise<Client> {
    const client = await this.findClientById(clientId, relations, select);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    await this.clientsRepository.softDelete(clientId);
    return client;
  }

  async updateClient(
    clientId: string,
    input: UpdateClientInput,
    relations?: FindOptionsRelations<Client>,
    select?: FindOptionsSelect<Client>,
  ): Promise<Client> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
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
    });

    return this.findClientById(clientId, relations, select);
  }

  async viewClientsReport(): Promise<ClientReport[]> {
    const rawData = await this.dataSource.query(
      `
      SELECT
        Cl.client_id as "clientId",
        Cl.name as "clientName",
        Co.name as "countryName"
      FROM client Cl
      LEFT OUTER JOIN country Co
        ON Cl.country_id = Co.country_id
      WHERE
        Cl.is_active = $1
    `,
      [true],
    );
    return rawData;
  }
}
