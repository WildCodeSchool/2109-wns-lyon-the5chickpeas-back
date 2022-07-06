import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./Project";
import { Task } from "./Task";

@ObjectType()
@Entity()
export class Status extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  //One status can have several projects
  @Field(() => [Project], { nullable: true })
  @OneToMany((type) => Project, (project) => project.status) // an project has one status
  projects?: Project[];

  //One status can have several tasks
  @Field(() => [Task], { nullable: true })
  @OneToMany((type) => Task, (task) => task.status) // an project has one status
  tasks?: Task[];
}
//no need
@InputType()
export class StatusInput {
  @Field()
  @Column()
  name!: string;
}
