import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserDto {
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
  role: string;

  @Field(() => [Number], { nullable: true })
  services?: number[];
}



@InputType()
export class AddStaffInput {
  @Field()
  shopId: number; // The ID of the shop

  @Field()
  @IsEmail()
  email: string; 

  @Field()
  password: string; 

  @Field({ nullable: true })
  firstName?: string; 

  @Field({ nullable: true })
  lastName?: string; 

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => [Int], { nullable: 'itemsAndList' })
  staffServiceCategories?: number[]; // Optional service categories the staff will belong to
}
