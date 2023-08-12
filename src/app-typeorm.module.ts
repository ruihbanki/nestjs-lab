import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';

const typeOrmConnectionDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'nestjs-lab',
  synchronize: true,
  logging: true,
});

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        await typeOrmConnectionDataSource.initialize();
        return typeOrmConnectionDataSource;
      },
    },
  ],
  exports: [DataSource],
})
export class AppTypeOrmModule {}
