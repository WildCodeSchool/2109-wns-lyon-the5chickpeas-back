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

  @ManyToMany((type) => User, (user) => user.tasks, {
    cascade: true,
  })
  @JoinTable()
  users?: User[];

  @ManyToOne(() => Project, (project) => project.tasks)
  project!: Project;

  @ManyToOne(() => User, user => user.status)
  status?: Status;

  @OneToMany((type) => Comment, (comment) => comment.task)
  comments!: Comment[];

  @OneToMany((type) => Asset, (asset) => asset.task)
  assets!: Asset[];
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