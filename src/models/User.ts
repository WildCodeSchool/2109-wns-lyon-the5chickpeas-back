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

  @Field()
  @Column()
  pseudo!: string;

  @Column()
  @Field()
  password!: string;

  @Field(() => [Role])
  @ManyToMany((type) => Role, (role) => role.users)
  roles!: Role[];

  @Field({ nullable: true })
  @Column({
    nullable: true,
  })
  validAccountToken!: string;
}

@InputType()
export class UserInput {
  @Field()
  pseudo!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  validAccountToken!: string;
}
