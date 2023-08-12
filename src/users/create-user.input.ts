import { Field, InputType } from '@nestjs/graphql';
import { MinLength, IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  username: string;

  @Field()
  password: string;

  @Field()
  @MinLength(3)
  firstName: string;

  @Field()
  @MinLength(3)
  lastName: string;

  @Field()
  dateOfBirth: string;
}
