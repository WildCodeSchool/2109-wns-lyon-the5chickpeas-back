// import { Arg, ID, Mutation, Query, Resolver, Authorized } from "type-graphql";
// import { getRepository } from "typeorm";
// import { Comment, CommentInput } from "../models/Comment";

// @Resolver(Comment)
// export class CommentsResolver {
//   private commentRepo = getRepository(Comment);

//   @Authorized()
//   @Query(() => [Comment])
//   async getcomments(): Promise<Comment[]> {
//     return await this.commentRepo.find();
//   }

//   // create comment
//   @Authorized()
//   @Mutation(() => Comment)
//   async addComment(
//     @Arg("data", () => CommentInput) comment: CommentInput
//   ): Promise<Comment> {
//     const newComment = this.commentRepo.create(comment);
//     await newComment.save();
//     return newComment;
//   }

//   // delete comment
//   @Authorized()
//   @Mutation(() => Boolean)
//   async deleteComment(@Arg("id", () => ID) id: number): Promise<Boolean> {
//     const comment = await this.commentRepo.findOne(id);
//     if (comment) {
//       await comment.remove();
//       return true;
//     }
//     return false;
//   }

//   // update comment
//   @Authorized()
//   @Mutation(() => Comment)
//   async updateComment(
//     @Arg("id", () => ID) id: number,
//     @Arg("description") description: string
//   ): Promise<Comment | null> {
//     const comment = await this.commentRepo.findOne({ id });
//     if (comment) {
//       if (comment.description) {
//         comment.description = description;
//       }
//       await comment.save();
//       return comment;
//     } else {
//       return null;
//     }
//   }
// }
