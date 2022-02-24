import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User";

@ObjectType() // Decorateur type-graphql
@Entity() // Decorateur typeorm
export class Role extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => User)
  @ManyToMany((type) => User, (user) => user.roles)
  @JoinTable()
  users!: User[];
}

@InputType()
export class RoleInput {
  @Field()
  name!: string;
}
