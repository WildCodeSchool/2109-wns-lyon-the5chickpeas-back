import "reflect-metadata";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
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
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column()
  createdDate: Date;

  @Field()
  @Column()
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dateLimit: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  estimatedTime: number;

  @Field(() => Status)
  @Column({ nullable: true })
  @ManyToOne((type) => Status, (status) => status.projects) // an project has one status
  status: Status;

  @Field(() => [Task])
  @Column({ nullable: true })
  @OneToMany((type) => Task, (task) => task.project) // an project has several tasks
  tasks: Task[];

  //one project has several managers
  @Field(() => [Manager])
  @Column({ nullable: true })
  @ManyToMany((type) => Manager, (manager) => manager.projects)
  managers: Manager[];

  //one project can have serveral collaborators
  @Field(() => [Member])
  @Column({ nullable: true })
  @ManyToMany((type) => Member, (member) => member.projects)
  members: Member[];

  constructor(status: Status, tasks: Task[], managers: Manager[], members: Member[]) {
    super();
    this.status = status;
    this.tasks = tasks;
    this.managers = managers;
    this.members = members;
  }
}

@InputType()
export class ProjectInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  createdDate: Date;

  @Field()
  description: string;

  @Field({ nullable: true })
  dateLimit: Date;

  @Field({ nullable: true })
  estimatedTime: number;
}
