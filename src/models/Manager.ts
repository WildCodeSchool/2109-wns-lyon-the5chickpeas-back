import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  OneToOne,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@ObjectType() // Decorateur type-graphql
@Entity() // Decorateur typeorm
export class Manager extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((type) => [Project])
  @ManyToMany((type) => Project, (project) => project.managers)
  @JoinTable()
  projects?: Project[];

  @Field() //to get all properties of the User
  @OneToOne(() => User)
  @JoinColumn()
  user!: User;
}
