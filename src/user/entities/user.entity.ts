import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { CustomerPreferredServiceCategory } from './customer-preferred-service-category.entity';
import { StaffServiceCategory } from './staff-service-category.entity';
import { StaffAvailability } from './staff-availabiity.entity';
import { StaffAvailabilityOverride } from './staff-availability-override.entity';
import { UserVerification } from './user-verifications.entity';
import { Shop } from 'src/shops/entities/shop.entity';

@ObjectType()
@Entity({ name: "users" })
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'first_name' })
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'phone' })
  phone: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'country_code' })
  countryCode: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password: string;

  @Field(() => Role)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })  // This will create a role_id column in the users table
  role: Role;

  @Field({ nullable: true })
  @Column({ nullable: true, name: "social_provider" })
  socialProvider: string; // e.g., 'google', 'facebook'

  @Field({ nullable: true })
  @Column({ nullable: true, name: "social_id" })
  socialId: string; // Unique ID from the provider

  @Field({ nullable: true })
  @Column('float', { nullable: true })
  latitude: number; // User's latitude

  @Field({ nullable: true })
  @Column('float', { nullable: true })
  longitude: number; // User's longitude

  @Field(() => Shop, { nullable: true })
  @ManyToOne(() => Shop, (shop) => shop.staff, { nullable:true })
  @JoinColumn({ name: 'shop_id' })  // This will create a role_id column in the users table
  shop: Shop;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; 

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

//   @Field(() => [CustomerPreferredServiceCategory], { nullable: true })
  @OneToMany(() => CustomerPreferredServiceCategory, (pref) => pref.customer, { nullable: true, cascade: true })
  preferredServiceCategories: CustomerPreferredServiceCategory[];

//   @Field(() => [StaffServiceCategory], { nullable: true })
  @OneToMany(() => StaffServiceCategory, (staffCat) => staffCat.staff, { nullable: true, cascade: true })
  staffServiceCategories: StaffServiceCategory[];

//   @Field(() => [StaffAvailability], { nullable: true })
  @OneToMany(() => StaffAvailability, (availability) => availability.staff, { nullable: true, cascade: true })
  staffAvailabilities: StaffAvailability[];

//   @Field(() => [StaffAvailabilityOverride], { nullable: true })
  @OneToMany(() => StaffAvailabilityOverride, (override) => override.staff, { nullable: true, cascade: true })
  staffAvailabilityOverrides: StaffAvailabilityOverride[];

  @Field(() => [UserVerification], { nullable: true })
  @OneToMany(() => UserVerification, (code) => code.user, { nullable: true, cascade: true })
  verificationCodes: UserVerification[];
}
