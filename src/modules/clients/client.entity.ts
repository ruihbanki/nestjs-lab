import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EntityBase } from 'src/utils/entity-base';
import { Country } from 'src/modules/countries/country.entity';
import { User } from 'src/modules/users/user.entity';
import { ClientContact } from 'src/modules/client-contacts/client-contact.entity';
import { Trim } from 'src/utils/trim.decorator';

@Entity()
@ObjectType()
export class Client extends EntityBase {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'client_id' })
  clientId: string;

  @Field()
  @Column()
  @Trim()
  name: string;

  @Field()
  @Column({ unique: true })
  domain: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string;

  @Field()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field(() => Country)
  @ManyToOne(() => Country, { nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Field(() => [ClientContact], { nullable: false })
  @OneToMany(() => ClientContact, (clientContact) => clientContact.client, {
    nullable: false,
    cascade: true,
  })
  contacts?: ClientContact[];
}
