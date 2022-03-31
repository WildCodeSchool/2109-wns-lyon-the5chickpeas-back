import { Arg, ID, Mutation, Query, Resolver, Authorized, Ctx } from "type-graphql";
import { getRepository } from "typeorm";
import { Comment, CommentInput } from "../models/Comment";
import { User } from "../models/User";
import { Task } from "../models/Task";

@Resolver(Comment)
export class CommentsResolver {
  private commentRepo = getRepository(Comment);
  private taskRepo = getRepository(Task);

  @Authorized()
  @Query(() => [Comment])
  async getcomments(): Promise<Comment[]> {
    return await this.commentRepo.find();
  }

  // create comment
  @Authorized()
  @Mutation(() => Comment)
  async addComment(
    @Arg("taskId") taskId: number,
    @Arg("data", () => CommentInput) comment: CommentInput,
    @Ctx()
    context: {
      token: string;
      userAgent: string;
      user: User | null;
    }
  ): Promise<Comment> {
    const newComment = this.commentRepo.create(comment);
    const currentUser: User | null = context.user;
    const task = await this.taskRepo.findOne(taskId);
    
    newComment.user = currentUser as User;
    newComment.task = task as Task;
    newComment.date = new Date().toISOString();
    await newComment.save();
    return newComment;
  }

  // delete comment
  @Authorized()
  @Mutation(() => Boolean)
  async deleteComment(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const comment = await this.commentRepo.findOne(id);
    if (comment) {
      await comment.remove();
      return true;
    }
    return false;
  }

  // update comment
  @Authorized()
  @Mutation(() => Comment)
  async updateComment(
    @Arg("id", () => ID) id: number,
    @Arg("description") description: string
  ): Promise<Comment | null> {
    const comment = await this.commentRepo.findOne(id);
    if (comment) {
      if (comment.description) {
        comment.description = description;
      }
      await comment.save();
      return comment;
    } else {
      return null;
    }
  }
}
