import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateServiceCategoryInput {
  @Field({ nullable: true })
  name?: string; 

  @Field({ nullable: true })
  description?: string; 
}
