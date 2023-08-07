# Introduction

The goal for this project is to experiment some solutions for common scenarios using Nests, GraphQL and TypeORM

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

- Use uuid and id? Is it necessary?

```
@Field(() => ID)
@PrimaryGeneratedColumn('uuid')
id: string;
```

## Saving default values

```
@Column({ default: true })
isActive: boolean;
```

## Unique fields

```
@Field()
@Column({ unique: true })
domain: string;
```

## Optional fields

```
@Field({ nullable: true })
@Column({ nullable: true })
website?: string;
```

## Entity base

Extend this class to enable creating and update of some columns

```
@ObjectType()
@Entity()
export abstract class EntityBase {
  @Field()
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Field()
  @UpdateDateColumn()
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

# Auth

- Create an @AuthData('userId') parameter decorator? Returns the data from the token and throw an UnauthorizedException in case of an inexistent data. E.g. Some tokens can have a clientId, userId or both.
- How create an abstraction to easily migrate to an external service.
- Integrate with OAuth

# Indexes

- How create indexes for full text search for fields like "firstName" and "lastName"? One index for each column or one for both?
- Sort fields required indexes?
