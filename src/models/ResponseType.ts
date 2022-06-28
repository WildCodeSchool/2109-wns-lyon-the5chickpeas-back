import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ResponseType {
  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  errorMessage?: string;
}
