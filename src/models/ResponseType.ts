import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ResponseType {
  @Field({ nullable: true })
  authorizationToken?: string;

  @Field({ nullable: true })
  errorMessage?: string;
}
