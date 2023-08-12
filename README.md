# Introduction

The goal for this project is to experiment some solutions for common scenarios using Nests, GraphQL and TypeORM

# Scripts

run on http://localhost:5000/graphql
`npm run start:dev`

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

```
@Field()
@Column({ name: 'date_of_birth', type: 'date' })
dateOfBirth: string;
```

## Date time field

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
}
```

# Input

# CRUD

## Create

## Update

## Delete

# Find

## Pagination

### Offset pagination

### Cursor pagination

## Sort

## Performance

Use the custom @Relations decorator to return the relations to be used in the find method. It gets this using the graphql info. E.g. { clients: true }.

Use the custom @Select decorator to return only the required query fields. E.g. { name: true, client: { id:true }}.

```
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async findUsers(
    @Relations() relations: FindOptionsRelations<User>,
    @Select() select: FindOptionsSelect<User>,
    @Args() args?: FindUsersArgs,
  ) {
    const { withDeleted } = args;
    return this.usersService.findUsers({ withDeleted, relations, select });
  }
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
  country: Country;
}
```

## Many to many with one side

Just the User has a list of clients. The client doesn't have an users field.

```
@Entity()
@ObjectType()
export class User extends EntityBase {
  @Field(() => [Client], { nullable: true })
  @ManyToMany(() => Client, { nullable: true })
  @JoinTable()
  clients?: Client[];
}
```

## Many to many with both sides

```
@Entity()
@ObjectType()
export class Client {
  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.clients, { nullable: true })
  users?: User[];
}

@Entity()
@ObjectType()
export class User {
  @Field(() => [Client], { nullable: true })
  @ManyToMany(() => Client, (client) => client.users, { nullable: true })
  @JoinTable()
  clients?: Client[];
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
