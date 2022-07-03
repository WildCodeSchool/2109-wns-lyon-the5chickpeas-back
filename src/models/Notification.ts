import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany, 
  JoinTable
} from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";
import { Project } from './Project';

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  read!: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  created_at?: String;

  @Field({ nullable: true })
  @Column({ nullable: true })
  read_at?: String;

  // Une notif pour une personne / une pers pour plrs notifs => OneToMany
  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.notifications)
  users!: User;

  /*// Une notification est liée à UN project
  @Field(() => Project)
  @ManyToOne((type) => Project, (project) => project.notifications)
  project!: Project;*/

}

@InputType()
export class NotificationInput {
  @Field()
  @Column()
  name!: string;
}

// Système de LOG 
