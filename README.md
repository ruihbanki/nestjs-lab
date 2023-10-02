# Introduction

The goal for this project is to experiment some solutions for common scenarios using Nests, GraphQL and TypeORM

# Scripts

Run playground
`npm run start:dev`
run on http://localhost:5000/graphql

Run migrations
`npm run migration:run`

Revert migrations
`npm run migration:revert`

# Migrations

Create a migration file
`npx typeorm migration:create ./src/migrations/DeleteAll`

# Entities

## Class definition

Decorate the class with @Entity() and @ObjectType()

```
@Entity()
@ObjectType()
export class User {
  ...
}
```

## Primary ID

```
@Field(() => ID)
@PrimaryGeneratedColumn('uuid', { name: 'user_id' })
userId: string;
```

## Default value

```
@Column({ name: 'is_active', default: true })
isActive: boolean;
```

## Unique field

- How return a better error message?
- Are there indexes naming conventions?

```
@Entity()
@ObjectType()
@Index('IDX_username', ['client.clientId', 'username'], { unique: true })
export class User extends EntityBase {
  @Field()
  @IsEmail()
  @Column()
  username: string;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;
}

```

## Optional field

```
@Field({ nullable: true })
@Column({ nullable: true })
website?: string;
```

## Date field

- It resolves as an string yyyy-mm-dd

```
@Field()
@Column({ name: 'date_of_birth', type: 'date' })
dateOfBirth: string;
```

## Date time field

- What happens when passing a date as an argument and contains or not timezone?

```
@Field()
@CreateDateColumn({ name: 'created_at' })
createdAt?: Date;
```

## Integer field

```
@Field()
@Column({ type: 'int' })
available: number;
```

## Decimal field

- When passing a number with more decimals it is rounded

```
@Field()
@Column({ type: 'decimal', precision: 10, scale: 2 })
price: number;
```

## Entity base

Extend this class to enable creating and update of some columns

```
@ObjectType()
@Entity()
export abstract class EntityBase {
  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}

@Entity()
@ObjectType()
export class Client extends EntityBase {
  ...
}

```

# Relations

## Many to one

```
@Entity()
@ObjectType()
export class Client extends EntityBase {
  @Field(() => Country)
  @ManyToOne(() => Country, { nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
```

## Many to many with both sides

- insert categories when creating a product
- delete categories when deleting a product
- updating a product with categories is not working

```
@Entity()
@ObjectType()
export class Product {
  @Field(() => [ProductCategory], { nullable: true })
  @ManyToMany(
    () => ProductCategory,
    (productCategory) => productCategory.products,
    { nullable: true },
  )
  @JoinTable({
    name: 'product_product_category',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'productId',
    },
    inverseJoinColumn: {
      name: 'product_category_id',
      referencedColumnName: 'productCategoryId',
    },
  })
  categories?: ProductCategory[];
}

@Entity()
@ObjectType()
export class ProductCategory {
  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.categories, {
    nullable: true,
  })
  products: Product[];
}
```

## One to many cascade

When creating or updating a new entity, delete all existent children and add new ones and when deleting the parent delete the children too.

- The creation is done by the cascade = true.
- The deletion is done by the onDelete: 'CASCADE'.
- The updating is done by a custom code, child items with id will be updated, child items without id will be inserted and items that weren't inserted or updated are deleted.

```
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsRelations,
  FindOptionsSelect,
  In,
  Not,
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

      // get the client without the contacts and update
      const { contacts, ...client } = input;
      clientsRepository.update(clientId, client);

      if (contacts) {
        // add client to contacts
        const contactsWithClient = contacts.map((contact) => ({
          ...contact,
          client: {
            clientId,
          },
        }));

        // create contacts without id
        const contactsToCreate = contactsWithClient.filter(
          (contact) => !contact.clientContactId,
        );
        const created = await clientContactsRepository.save(contactsToCreate);

        // update contacts with id
        const contactsToUpdate = contacts.filter(
          (contact) => !!contact.clientContactId,
        );
        clientContactsRepository.save(contactsToUpdate);

        // delete all contacts the weren't created or updated
        const createdIds = created.map((contact) => contact.clientContactId);
        const updatedIds = contacts
          .filter((contact) => !!contact.clientContactId)
          .map((contact) => contact.clientContactId);
        const idsToNotDelete = [...createdIds, ...updatedIds];
        clientContactsRepository.delete({
          client: { clientId },
          clientContactId: Not(In(idsToNotDelete)),
        });
      }
    });

    return this.findClientById(clientId, relations, select);
  }
}

```

# CRUD

## Create

```
@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Mutation(() => Product)
  async createProduct(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('input') input: CreateProductInput,
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
  ) {
    return this.productsService.createProduct(
      clientId,
      input,
      relations,
      select,
    );
  }
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createProduct(
    clientId: string,
    product: CreateProductInput,
    relations?: FindOptionsRelations<Product>,
    select?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    const result = await this.productsRepository.save({
      ...product,
      client: {
        clientId,
      },
    });
    return this.findProductById(clientId, result.productId, relations, select);
  }
}

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field(() => [CategoryInput])
  categories: CategoryInput[];
}

@InputType()
class CategoryInput {
  @Field()
  productCategoryId: string;
}


```

## Update

```
@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Mutation(() => Product)
  async updateProduct(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('productId') productId: string,
    @Args('input') input: UpdateProductInput,
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
  ) {
    return this.productsService.updateProduct(
      clientId,
      productId,
      input,
      relations,
      select,
    );
  }
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async updateProduct(
    clientId: string,
    productId: string,
    input: UpdateProductInput,
    relations?: FindOptionsRelations<Product>,
    select?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    await this.productsRepository.update(
      {
        productId,
        client: {
          clientId,
        },
      },
      input,
    );
    return await this.findProductById(clientId, productId, relations, select);
  }
}

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}

```

## Delete

```
@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Mutation(() => Product)
  async deleteProduct(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('productId') productId: string,
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
  ) {
    return this.productsService.deleteProduct(
      clientId,
      productId,
      relations,
      select,
    );
  }
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async deleteProduct(
    clientId: string,
    productId: string,
    relations?: FindOptionsRelations<Product>,
    select?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    const product = await this.findProductById(
      clientId,
      productId,
      relations,
      select,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productsRepository.softDelete({
      productId,
      client: {
        clientId,
      },
    });
    return product;
  }
}


```

# Find

- return entities and usually use the typeorm find method
- can have nested entities

## Pagination

### Offset pagination

- easy to implement
- can go to a specific page
- has issues when adding or removing rows

### Cursor pagination

- the most recommended way
- cursor is a base 64 key with all sorted keys and always needs to include the id
- requires a column with sequential numbers

## Sort

# View

- Not required to use a database view
- Does not return entities, returns DTOs instead
- Usually implemented with custom sql

```
@Entity()
@ObjectType()
export class ClientReport {
  @Field(() => ID)
  clientId: string;

  @Field()
  clientName: string;

  @Field()
  countryName: string;
  }

  @Injectable()
  export class ClientsService {
    constructor(
    @InjectDataSource()
      private dataSource: DataSource,
    ) {}

    async viewClientReport(): Promise<ClientReport[]> {
    const rawData = await this.dataSource.manager.query(`
      SELECT
        Cl.client_id as "clientId",
        Cl.name as "clientName",
        Co.name as "countryName"
      FROM client Cl
      LEFT OUTER JOIN country Co
        ON Cl.country_id = Co.country_id`);
      return rawData;
    }
}

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private clientsService: ClientsService) {}

  @Query(() => [ClientReport])
  async viewClientsReport() {
    return this.clientsService.viewClientReport();
  }
}

```

# Relations decorator

Use the custom @Relations decorator to return the relations to be used in the find method. It gets this using the graphql info. E.g. { clients: true }.

```
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async findUsers(
  @Relations() relations: FindOptionsRelations<User>,
  ) {
    return this.usersService.findUsers({ relations });
  }
}

```

# Select decorator

Use the custom @Select decorator to return only the required query fields. E.g. { name: true, client: { id:true }}.

```
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async findUsers(
  @Select() select: FindOptionsSelect<User>,
  ) {
    return this.usersService.findUsers({ select });
  }
}

```

# Auth

- Create an @AuthData('userId') parameter decorator? Returns the data from the token and throw an UnauthorizedException in case of an inexistent data. E.g. Some tokens can have a clientId, userId or both.
- How create an abstraction to easily migrate to an external service.
- Integrate with OAuth?
- Is it possible to create multiples schemas depending on @AuthData? This could be use to help the developer to find public operations.

# Indexes

- How create indexes for full text search for fields like "firstName" and "lastName"? One index for each column or one for both?
- Sort fields required indexes?

# Config

```

@Resolver(() => Client)
export class ClientsResolver {
constructor(
private configService: ConfigService<IAppConfigService>,
) {}
}

```

```

```
