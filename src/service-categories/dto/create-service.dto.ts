import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateServiceCategoryInput {
  @Field()
  name: string; 

  @Field({ nullable: true })
  description?: string; 
}
