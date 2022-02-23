import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Role } from "./Role";
import { Notification } from "./Notification";
//import { Project } from "./Project";

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

  // @ManyToMany((type) => Project, (project) => project.users, {
  //   cascade: true,
  // })
  // @JoinTable()
  // projects!: Project[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications?: Notification[];
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
