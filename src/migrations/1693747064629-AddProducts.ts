import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';

interface Client {
  client_id: string;
  name: string;
  domain: string;
  website: string;
  country_id: string;
}

export class AddProducts1693747064629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.insertProducts(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "product"');
  }

  private async insertProducts(queryRunner: QueryRunner) {
    const clients = await this.selectAllClients(queryRunner);
    const clientId = clients.find((row) => row.name === 'Client 1').client_id;
    const totalProducts = 10000;
    for (let index = 0; index < totalProducts; index++) {
      await this.insertProduct(
        queryRunner,
        faker.commerce.productName(),
        Number(faker.commerce.price({ min: 10, max: 1000 })),
        faker.number.int({ min: 1, max: 100 }),
        clientId,
      );
    }
  }

  private async insertProduct(
    queryRunner: QueryRunner,
    name: string,
    price: number,
    available: number,
    client_id: string,
  ) {
    await queryRunner.query(
      `INSERT INTO "product" 
        (name, price, available, client_id)
      VALUES 
        ('${name}', '${price}', '${available}', '${client_id}')`,
    );
  }

  private async selectAllClients(queryRunner: QueryRunner): Promise<Client[]> {
    return queryRunner.query(`SELECT * FROM "client"`);
  }
}
