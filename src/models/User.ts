import { type } from "os";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Comment } from "./Comment";
import { Role } from "./Role";
import { Task } from "./Task";

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

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments!: Comment[];

  @ManyToMany((type) => Task, (task) => task.users)
  tasks?: Task[]
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
