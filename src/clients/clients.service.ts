import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientInput } from './create-client.input';
import { UpdateUserInput } from 'src/users/update-user.input';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  findClients(): Promise<Client[]> {
    return this.clientsRepository.find({ relations: { users: true } });
  }

  findClientById(id: string): Promise<Client | null> {
    return this.clientsRepository.findOneBy({ id });
  }

  async createClient(user: CreateClientInput): Promise<Client> {
    return await this.clientsRepository.save(user);
  }

  async removeClient(id: string): Promise<boolean> {
    const result = await this.clientsRepository.delete(id);
    return result.affected > 0;
  }

  async updateClient(id: string, input: UpdateUserInput): Promise<void> {
    const result = await this.clientsRepository.update(id, input);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with the id '${id}' was not found.`);
    }
  }
}
