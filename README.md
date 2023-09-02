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

- Use the same class for both?
- Use DTO? Check nest-query docs.

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

```
@Field()
@Column({ unique: true })
domain: string;
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

- The creation is done by the cascade = true
- The deletion is done by the onDelete: 'CASCADE'
- The addition of new ones on update is made in a transaction

```
@Entity()
@ObjectType()
export class Client {
  @Field(() => [ClientContact], { nullable: false })
  @OneToMany(() => ClientContact, (clientContact) => clientContact.client, {
    nullable: false,
    cascade: true,
  })
  contacts?: ClientContact[];
}

@Entity()
@ObjectType()
export class ClientContact {
  @ManyToOne(() => Client, (client) => client.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;
}

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
    options: FindOptions = {},
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

    return this.findClientById(clientId, options);
  }
}
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

## Inheritance

# Input

# CRUD

## Create

## Update

## Delete

# Find

- return entities and usually use the typeorm find method
- can have nested entities

## Pagination

### Offset pagination

### Cursor pagination

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
