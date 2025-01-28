import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { CustomerPreferredServiceCategory } from 'src/user/entities/customer-preferred-service-category.entity';
import { StaffServiceCategory } from 'src/user/entities/staff-service-category.entity';

@ObjectType()
@Entity({ name: "service_category" })
export class ServiceCategory {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; 

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => CustomerPreferredServiceCategory, { nullable: true })
  userPreferredServiceCategories: CustomerPreferredServiceCategory[];

  @ManyToMany(() => StaffServiceCategory, { nullable: true })
  staffServiceCategory: StaffServiceCategory[];

  @ManyToMany(() => Shop, { nullable: true })
  shops: Shop[];
}
