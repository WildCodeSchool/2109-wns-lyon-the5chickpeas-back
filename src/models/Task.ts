import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Asset } from "./Asset";
import { Comment } from "./Comment";
import { User } from "./User";
import { Notification } from "./Notification";
import { Project } from "./Project";
import { Status } from "./Status";

@ObjectType()
@Entity()
export class Task extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  subject!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column({ nullable: true })
  totalTimeSpent?: number;

  @Field()
  @Column()
  progress?: number;

  @Field()
  @Column({ nullable: true })
  dueDate?: Date;

  @Field()
  @Column({ nullable: true })
  initialTimeSpentEstimated?: number;

  @Field(() => [User])
  @ManyToMany((type) => User, (user) => user.tasks)
  @JoinTable()
  users!: User[];

  @Field(() => Project)
  @ManyToOne((type) => Project, (project) => project.tasks)
  project!: Project;

  @Field(() => Status)
  @ManyToOne((type) => Status, (status) => status.tasks)
  status!: Status;

  @Field(() => [Comment], { nullable: true })
  @Column({ nullable: true })
  @OneToMany((type) => Comment, (comment) => comment.task)
  comments?: Comment[];

  @Field(() => [Asset], { nullable: true })
  @Column({ nullable: true })
  @OneToMany((type) => Asset, (asset) => asset.task)
  assets?: Asset[];

  @Field(() => [Notification], { nullable: true })
  @Column({ nullable: true })
  @OneToMany((type) => Notification, (notification) => notification.task)
  notifications?: Notification[];
}

@InputType()
export class TaskInput {
  @Field()
  subject!: string;

  @Field()
  description!: string;

  @Field()
  totalTimeSpent?: number;

  @Field()
  progress?: number;

  @Field()
  dueDate?: Date;

  @Field()
  initialTimeSpentEstimated?: number;
}
