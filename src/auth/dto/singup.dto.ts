import { InputType, Field, Int } from '@nestjs/graphql';
import { USER_ROLE_ENUM } from 'src/types/role-type.enum';

@InputType()
export class SignupInput {
  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  gender: string;

  @Field({ nullable: true })
  countryCode: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => USER_ROLE_ENUM, { nullable: true })
  role?: USER_ROLE_ENUM;

  @Field({ nullable: true })
  socialProvider?: string; // google, facebook

  @Field({ nullable: true })
  socialId?: string;

  @Field(() => [Int], { nullable: true })
  preferredServiceCategories?: number[];
}
