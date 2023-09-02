import { MigrationInterface, QueryRunner } from 'typeorm';

interface Country {
  country_id: string;
  name: string;
  iso: string;
}

export class StartSample1693677633630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.insertCountries(queryRunner);
    await this.insertClients(queryRunner);
    await this.insertUsers(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "product_product_category"');
    await queryRunner.query('DELETE FROM "product_category"');
    await queryRunner.query('DELETE FROM "product"');
    await queryRunner.query('DELETE FROM "user"');
    await queryRunner.query('DELETE FROM "client_contact"');
    await queryRunner.query('DELETE FROM "client"');
    await queryRunner.query('DELETE FROM "country"');
  }

  private async insertCountries(queryRunner: QueryRunner) {
    await this.insertCountry(queryRunner, 'United States', 'USA');
    await this.insertCountry(queryRunner, 'Canada', 'CAN');
  }

  private async insertCountry(
    queryRunner: QueryRunner,
    name: string,
    iso: string,
  ) {
    await queryRunner.query(
      `INSERT INTO "country" (name, iso) VALUES ('${name}', '${iso}')`,
    );
  }

  private async insertClients(queryRunner: QueryRunner) {
    const clients = await this.selectAllCountries(queryRunner);
    const usaId = clients.find((row) => row.iso === 'USA').country_id;
    const canId = clients.find((row) => row.iso === 'USA').country_id;
    await this.insertClient(
      queryRunner,
      'Client 1',
      'client-1',
      'www.client-1.com',
      usaId,
    );
    await this.insertClient(
      queryRunner,
      'Client Canada 1',
      'client-canada-1',
      'www.client-canada-1.com',
      canId,
    );
  }

  private async insertClient(
    queryRunner: QueryRunner,
    name: string,
    domain: string,
    website: string,
    country_id: string,
  ) {
    await queryRunner.query(
      `INSERT INTO "client" (name, domain, website, country_id) VALUES ('${name}', '${domain}', '${website}', '${country_id}')`,
    );
  }

  private async insertUsers(queryRunner: QueryRunner) {
    await this.insertUser(
      queryRunner,
      'user-1',
      '1',
      'User',
      '1',
      '2000-01-01',
    );
  }

  private async insertUser(
    queryRunner: QueryRunner,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    date_of_birth: string,
  ) {
    await queryRunner.query(
      `INSERT INTO "user" 
        (username, password, first_name, last_name, date_of_birth, is_active, is_super)
      VALUES 
        ('${username}', '${password}', '${first_name}', '${last_name}', '${date_of_birth}', true, true)`,
    );
  }

  private async selectAllCountries(
    queryRunner: QueryRunner,
  ): Promise<Country[]> {
    return queryRunner.query(`SELECT * FROM "country"`);
  }
}
