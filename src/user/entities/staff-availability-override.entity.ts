import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: "staff_availabilities_override" })
export class StaffAvailabilityOverride {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.staffAvailabilityOverrides, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff: User;

  @Field()
  @Column({ type: 'date', nullable: false, name: "date" })
  date: Date;

  @Field({ nullable: true })
  @Column({ type: 'time', nullable: true, name: "start_time" })
  startTime: string;

  @Field({ nullable: true })
  @Column({ type: 'time', nullable: true, name: "end_time" })
  endTime: string;

  @Field()
  @Column({ default: true, name: "is_available" })
  isAvailable: boolean;

  @Field({ nullable: true })
  @Column({ type: 'int', default: 30, name: "slot_duration" })
  slotDuration: number;

}
