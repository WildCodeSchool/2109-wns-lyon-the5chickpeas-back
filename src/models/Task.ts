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

  // @ManyToMany((type) => User, (user) => user.tasks, {
  //   cascade: true,
  // })
  // @JoinTable()
  // users?: User[];

  // @ManyToOne((type) => Project, (project) => project.tasks)
  // project!: Project;

  @ManyToOne(() => Status, (status) => status.tasks)
  status?: Status;

  @OneToMany((type) => Comment, (comment) => comment.task)
  comments!: Comment[];

  @OneToMany((type) => Asset, (asset) => asset.task)
  assets!: Asset[];

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
