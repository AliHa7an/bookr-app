import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { USER_ROLE_ENUM } from 'src/types/role-type.enum';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  user: User
}



@InputType()
export class LoginInput {
  @Field()
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  socialProvider?: string; // google, facebook

  @Field({ nullable: true })
  socialId?: string;
}
