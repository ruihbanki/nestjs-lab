import { MigrationInterface, QueryRunner } from 'typeorm';

export class StartSample1693677633630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.insertCountries(queryRunner);
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
}
