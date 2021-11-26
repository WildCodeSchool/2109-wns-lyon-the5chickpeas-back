import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // Decorateur type-graphql
@Entity() // Decorateur typeorm
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    pseudo!: string;

    @Field()
    @Column()
    email!: string;

    @Field()
    @Column()
    password!: string;

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