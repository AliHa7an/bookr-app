import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  countryCode?: string;

  @Field({ nullable: true })
  password?: string;

  @Field()
  role?: string;

  @Field(() => [Number], { nullable: true })
  services?: number[];
}
