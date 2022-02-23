import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Task } from "./Task";
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

  //One notif can be linked to one user
  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.notifications)
  user?: User;

  //One notif can be linked to one task
  @Field(() => Task)
  @ManyToOne((type) => Task, (task) => task.notifications)
  task?: Task;

  //One notif can be linked to one comment
  @Field(() => Comment)
  @ManyToOne((type) => Comment, (comment) => comment.notifications)
  comment?: Comment;
}

@InputType()
export class NotificationInput {
  @Field()
  @Column()
  name!: string;
}
