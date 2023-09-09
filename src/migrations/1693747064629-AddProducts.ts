import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuidV4 } from 'uuid';

interface Client {
  client_id: string;
  name: string;
  domain: string;
  website: string;
  country_id: string;
}

export class AddProducts1693747064629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.insertProductCategories(queryRunner);
    await this.insertProducts(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "product"');
    await queryRunner.query('DELETE FROM "product_category"');
  }

  private async insertProductCategories(queryRunner: QueryRunner) {
    const clients = await this.selectAllClients(queryRunner);
    const clientId = clients.find((row) => row.name === 'Client 1').client_id;
    const totalProductCategories = 10;
    for (let index = 0; index < totalProductCategories; index++) {
      await this.insertProductCategory(
        queryRunner,
        faker.word.sample(),
        clientId,
      );
    }
  }

  private async insertProductCategory(
    queryRunner: QueryRunner,
    name: string,
    client_id: string,
  ) {
    await queryRunner.query(
      `INSERT INTO "product_category" 
        (name, client_id)
      VALUES 
        ('${name}', '${client_id}')`,
    );
  }

  private async insertProducts(queryRunner: QueryRunner) {
    const clients = await this.selectAllClients(queryRunner);
    const categoryIds = await this.selectAllProductCategoryIds(queryRunner);
    const clientId = clients.find((row) => row.name === 'Client 1').client_id;
    const totalProducts = 100;
    for (let index = 0; index < totalProducts; index++) {
      const categories = categoryIds
        .map((item) => item.product_category_id)
        .sort(() => (Math.random() > 0.5 ? -1 : 1))
        .slice(0, Math.floor(Math.random() * 4));
      await this.insertProduct(
        queryRunner,
        faker.commerce.productName(),
        Number(faker.commerce.price({ min: 10, max: 1000 })),
        clientId,
        categories,
      );
    }
  }

  private async insertProduct(
    queryRunner: QueryRunner,
    name: string,
    price: number,
    client_id: string,
    categories: string[],
  ) {
    const product_id = uuidV4();
    await queryRunner.query(
      `INSERT INTO "product" 
        (product_id, name, price, client_id)
      VALUES 
        ('${product_id}', '${name}', ${price}, '${client_id}')`,
    );

    for (let index = 0; index < categories.length; index++) {
      await queryRunner.query(
        `INSERT INTO "product_product_category" 
          (product_id, product_category_id)
        VALUES 
          ('${product_id}', '${categories[index]}')`,
      );
    }
  }

  private async selectAllClients(queryRunner: QueryRunner): Promise<Client[]> {
    return queryRunner.query(`SELECT * FROM "client"`);
  }

  private async selectAllProductCategoryIds(
    queryRunner: QueryRunner,
  ): Promise<{ product_category_id: string }[]> {
    return queryRunner.query(
      `SELECT product_category_id FROM "product_category"`,
    );
  }
}
