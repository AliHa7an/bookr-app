import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Shop } from './shop.entity';

@ObjectType()
@Entity({ name: "shop_opening_override" })
export class ShopOpeningOverride {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Shop)
  @ManyToOne(() => Shop, (shop) => shop.openingOverrides, { nullable: false })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @Field()
  @Column({ type: 'date', nullable: false, name: "date" })
  date: Date;

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
