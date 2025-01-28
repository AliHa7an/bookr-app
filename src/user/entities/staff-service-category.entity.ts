import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ServiceCategory } from 'src/service-categories/entities/service-categories.entity';
import { Field } from '@nestjs/graphql';

@Entity({ name: "staff_service_categories" })
export class StaffServiceCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.staffServiceCategories, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff: User;

  @ManyToOne(() => ServiceCategory, (service) => service.staffServiceCategory, { nullable: false })
  @JoinColumn({ name: 'service_category_id' })
  serviceCategory: ServiceCategory;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; 

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
