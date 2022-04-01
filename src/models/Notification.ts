import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.notifications)
  user!: User;

  @Field(() => Comment)
  @ManyToOne((type) => Comment, (comment) => comment.notifications)
  comment!: Comment;
}

@InputType()
export class NotificationInput {
  @Field()
  @Column()
  name!: string;
}
