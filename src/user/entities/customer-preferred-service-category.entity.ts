import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ServiceCategory } from 'src/service-categories/entities/service-categories.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: "customer_preferred_services" })
export class CustomerPreferredServiceCategory {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.preferredServiceCategories, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  customer: User;

  @ManyToOne(() => ServiceCategory, (service) => service.userPreferredServiceCategories, { nullable: false })
  @JoinColumn({ name: 'service_category_id' })
  serviceCategory: ServiceCategory;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; 

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
