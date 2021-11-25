import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType() // Decorateur type-graphql
@Entity() // Decorateur typeorm
export class Role extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;
}

@InputType()
export class RoleInput {
  @Field()
  name!: string;
}
