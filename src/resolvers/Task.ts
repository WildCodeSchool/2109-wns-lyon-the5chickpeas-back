import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Task } from "../models/Task";

@Resolver(Task)
export class TaskResolver {
  private taskRepo = getRepository(Task);

  // get all tasks
  @Query(() => [Task])
  async getTasks(): Promise<Task[]> {
    return await this.taskRepo.find({ relations: ["users"] }); // à revoir avec l'equipe si on veut get par rapport au user ou au projet...
  }

  // delete task
  @Mutation(() => Boolean)
  async deleteTask(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const task = await this.taskRepo.findOne(id);
    if (task) {
      await task.remove();
      return true;
    }
    return false;
  }

  // update task
  @Mutation(() => Task)
  async updateTask(
    @Arg("id", () => ID) id: number,
    @Arg("subject") subject: string,
    @Arg("description") description: string,
    @Arg("totalTimeSpent") totalTimeSpent: number,
    @Arg("progress") progress: number,
    @Arg("dueDate") dueDate: Date,
    @Arg("initialTimeSpentEstimated") initialTimeSpentEstimated: number
  ): Promise<Task | null> {
    const task = await this.taskRepo.findOne(id);
    if (task) {
      Object.assign(task, {
        subject,
        description,
        totalTimeSpent,
        progress,
        dueDate,
        initialTimeSpentEstimated,
      });
      await task.save();
      return task;
    } else {
      return null;
    }
  }
}
