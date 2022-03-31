import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Task } from "./Task";

@ObjectType()
@Entity()
export class Asset extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => Task)
  @ManyToOne((type) => Task, (task) => task.assets)
  task!: Task;
}

@InputType()
export class AssetInput {
  @Field()
  name!: string;
}
