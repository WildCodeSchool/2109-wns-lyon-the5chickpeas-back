import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Task } from "./Task";
import { User } from "./User";
import { Notification } from "./Notification";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  description!: string;

  @Field(() => Task)
  @CreateDateColumn({ type: "datetime", nullable: false })
  // createdAt!: Date;
  @ManyToOne((type) => Task, (task) => task.comments)
  task!: Task;

  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.comments)
  user!: User;

  @Field(() => [Notification], { nullable: true })
  @OneToMany((type) => Notification, (notification) => notification.comment)
  notifications?: Notification[];
}

@InputType()
export class CommentInput {
  @Field()
  description!: string;
}
