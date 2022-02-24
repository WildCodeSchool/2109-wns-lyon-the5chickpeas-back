import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Column,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@ObjectType() // Decorateur type-graphql
@Entity() // Decorateur typeorm
export class Member extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => [Project])
  @Column({ nullable: true })
  @ManyToMany((type) => Project, (project) => project.members)
  @JoinTable()
  projects?: Project[];

  //to get all properties of the User
  @Field(() => User)
  @OneToOne((type) => User)
  @JoinColumn()
  user!: User;
}
