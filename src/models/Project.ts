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
} from "typeorm";
import { Status } from "./Status";
import { Manager } from "./Manager";
import { Member } from "./Member";
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

  @Field()
  @CreateDateColumn()
  createdDate!: Date;

  @Field()
  @Column()
  description!: string;

  @Field({ nullable: true })
  @Column()
  dueDate?: Date;

  @Field({ nullable: true })
  @Column()
  estimatedTime?: number;

  @Field(() => Status)
  @ManyToOne((type) => Status, (status) => status.projects) // an project has one status
  status!: Status;

  @Field(() => [Task])
  @OneToMany((type) => Task, (task) => task.project) // an project has several tasks
  tasks?: Task[];

  //one project has several managers
  @Field(() => [Manager])
  @ManyToMany((type) => Manager, (manager) => manager.projects)
  managers?: Manager[];

  //one project can have serveral collaborators
  @Field(() => [Member])
  @ManyToMany((type) => Member, (member) => member.projects)
  members?: Member[];
}

@InputType()
export class ProjectInput {
  @Field()
  @Column()
  name!: string;

  @Field()
  @CreateDateColumn()
  createdDate!: Date;

  @Field()
  @Column()
  description!: string;

  @Field({ nullable: true })
  @Column()
  dueDate?: Date;

  @Field({ nullable: true })
  @Column()
  estimatedTime?: number;
}
