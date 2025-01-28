import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ServiceCategory } from 'src/service-categories/entities/service-categories.entity';
import { ShopOpeningHours } from './shop-hours.entity';
import { ShopOpeningOverride } from './shop-opening-overrides.entity';

@ObjectType()
@Entity({ name: "shops" })
export class Shop {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column('float')
  latitude: number;

  @Field()
  @Column('float')
  longitude: number;

  
  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; 

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, {
    cascade: true,
   nullable: false })
   @JoinColumn({ name: 'owner_id' }) 
  owner: User;

  @Field(() => [ServiceCategory])
  @ManyToMany(() => ServiceCategory, { nullable: true })
  @JoinTable({
    name: 'shop_service_categories', 
    joinColumn: {
      name: 'shop_id', 
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'service_category_id', 
      referencedColumnName: 'id',
    },
  })
  serviceCategories: ServiceCategory[];

  @Field(() => [ShopOpeningHours], { nullable: true })
  @OneToMany(() => ShopOpeningHours, (hours) => hours.shop)
  openingHours: ShopOpeningHours[];

  @Field(() => [ShopOpeningOverride], { nullable: true })
  @OneToMany(() => ShopOpeningOverride, (override) => override.shop)
  openingOverrides: ShopOpeningOverride[];

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.role, { nullable: true })
  staff: User[];
}
