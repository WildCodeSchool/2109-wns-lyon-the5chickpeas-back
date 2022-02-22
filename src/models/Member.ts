import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
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
  @ManyToMany((type) => Project, (project) => project.members)
  @JoinTable()
  projects?: Project[];

  //to get all properties of the User
  @Field()
  @OneToOne(() => User)
  @JoinColumn()
  user!: User;
}

@InputType()
//when I create a member, I need it to be linked to a user & a project
export class MemberInput {
  @Field(() => [Project])
  @ManyToMany((type) => Project, (project) => project.members)
  @JoinTable()
  projects?: Project[];

  //to get all properties of the User
  @Field()
  @OneToOne(() => User)
  @JoinColumn()
  user!: User;
}
