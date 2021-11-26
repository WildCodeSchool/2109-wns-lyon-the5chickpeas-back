import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
} from "typeorm";
import { Role } from "./Role";

@ObjectType() // Decorateur type-graphql
@Entity() // Decorateur typeorm
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column()
  pseudo!: string;

  @Field(() => [Role])
  @ManyToMany((type) => Role, (role) => role.users)
  roles!: Role[];
}

@InputType()
export class UserInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  @Column()
  pseudo!: string;
}
