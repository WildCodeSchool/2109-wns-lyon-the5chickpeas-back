import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
} from "typeorm";
import { Status } from "./Status";
import { User } from "./User";
import { Task } from "./Task";

@ObjectType() //graphql
@Entity() //ORM
export class Project extends BaseEntity {
  @Field(() => ID) // graphql
  @PrimaryGeneratedColumn() //ORM
  id!: number;

  @Field()
  @Column()
  name!: string;

  // @Field()
  // @CreateDateColumn()
  // createdDate!: Date;

  @Field()
  @Column()
  description!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dueDate?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  estimatedTime?: number;

  @Field(() => Status)
  @ManyToOne((type) => Status, (status) => status.projects) // an project has one status
  status!: Status;

  // @Field(() => [Task])
  // @OneToMany((type) => Task, (task) => task.project) // an project has several tasks
  // tasks?: Task[];

  //one project has several managers
  @Field(() => [User])
  @ManyToMany((type) => User, (user) => user.projects, { eager: true })
  @JoinTable()
  managers!: User[];

  // //one project has several members
  // @Field(() => [User])
  // @ManyToMany((type) => User, (user) => user.projects)
  // @JoinTable()
  // members?: User[];
}

@InputType()
export class ProjectInput {
  @Field()
  @Column()
  name!: string;

  // @Field()
  // @CreateDateColumn()
  // createdDate!: Date;

  @Field()
  @Column()
  description!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dueDate?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  estimatedTime?: number;
}
