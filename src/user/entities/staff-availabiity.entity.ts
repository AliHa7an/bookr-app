import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: "staff_availabilities" })
export class StaffAvailability {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.staffAvailabilities, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff: User;

  @Field()
  @Column({ type: 'enum', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], name: "day" })
  day: string;

  @Field({ nullable: true })
  @Column({ type: 'time',  name: "start_time" })
  startTime: string;

  @Field({ nullable: true })
  @Column({ type: 'time', name: "end_time" })
  endTime: string;

  @Field({ nullable: true })
  @Column({ type: 'int', default: 30, name: "slot_duration" })
  slotDuration: number;

  @Field()
  @Column({ default: true, name: "is_available" })
  isAvailable: boolean;
}
