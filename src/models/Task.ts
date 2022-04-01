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

  @Field({ nullable: true })
  @Column({ nullable: true })
  totalTimeSpent?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  progress?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dueDate?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  initialTimeSpentEstimated?: number;

  @Field(() => [User])
  @ManyToMany((type) => User, (user) => user.tasks, {
    cascade: true,
  })
  @JoinTable()
  users!: User[];

  @Field(() => Project)
  @ManyToOne((type) => Project, (project) => project.tasks)
  project!: Project;

  @Field(() => Status, { nullable: true })
  @ManyToOne(() => Status, (status) => status.tasks)
  status?: Status;

  @Field(() => [Comment])
  @OneToMany((type) => Comment, (comment) => comment.task)
  comments!: Comment[];

  @Field(() => [Asset])
  @OneToMany((type) => Asset, (asset) => asset.task)
  assets!: Asset[];
}

@InputType()
export class TaskInput {
  @Field()
  subject!: string;

  @Field()
  description!: string;

  @Field({ nullable: true })
  totalTimeSpent?: number;

  @Field({ nullable: true })
  progress?: number;

  @Field({ nullable: true })
  dueDate?: string;

  @Field({ nullable: true })
  initialTimeSpentEstimated?: number;
}
