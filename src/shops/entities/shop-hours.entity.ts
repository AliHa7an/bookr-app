import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Shop } from './shop.entity';

@ObjectType()
@Entity({ name: "shop_opening_hours" })
export class ShopOpeningHours {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Shop)
  @ManyToOne(() => Shop, (shop) => shop.openingHours, { nullable: false })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @Field()
  @Column({ type: 'enum', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday-Saturday', 'Monday-Sunday', 'Monday-Friday'], name: "day" })
  day: string;

  @Field({ nullable: true })
  @Column({ type: 'time', nullable: true, name: "opening_time" })
  openingTime: string;

  @Field({ nullable: true })
  @Column({ type: 'time', nullable: true, name: "closing_time" })
  closingTime: string;

  @Field()
  @Column({ default: true, name: "is_open" })
  isOpen: boolean;
}
