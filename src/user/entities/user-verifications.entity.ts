import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity({ name: 'user_verification' })
export class UserVerification {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column()
  code: string; 

  @Field()
  @Column({ default: "email_verification" })
  type: string; 

  @Field({ nullable: true })
  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date; 

  @Field({ nullable: true })
  @Column({ default: false, name: 'is_used' })
  isUsed: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; 

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
