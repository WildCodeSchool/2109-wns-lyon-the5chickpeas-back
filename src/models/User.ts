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
import { Notification } from "./Notification";
import { Task } from "./Task";
import { Project } from "./Project";

@ObjectType() // Decorateur type-graphql
@Entity() // Decorateur typeorm permet de créer la base de données
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

  @Field(() => [Notification])
  @OneToMany((type) => Notification, (notification) => notification.user)
  notifications?: Notification[];

  @Field(() => [Comment])
  @OneToMany((type) => Comment, (comment) => comment.user)
  comments!: Comment[];

  @Field(() => [Task])
  @ManyToMany((type) => Task, (task) => task.users)
  tasks?: Task[];

  @Field(() => [Project])
  @ManyToMany((type) => Project, (project) => project.managers)
  @ManyToMany((type) => Project, (project) => project.members)
  projects?: Project[];
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
