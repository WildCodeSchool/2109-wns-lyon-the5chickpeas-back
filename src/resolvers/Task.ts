// import { Arg, ID, Mutation, Authorized, Query, Resolver } from "type-graphql";
// import { getRepository } from "typeorm";
// import { Task, TaskInput } from "../models/Task";

// @Resolver(Task)
// export class TasksResolver {
//   private taskRepo = getRepository(Task);

//   // get all tasks
//   @Authorized()
//   @Query(() => [Task])
//   async getTasks(): Promise<Task[]> {
//     return await this.taskRepo.find({ relations: ["users"] }); // à revoir avec l'equipe si on veut get par rapport au user ou au projet...
//   }

//   // create task
//   @Authorized()
//   @Mutation(() => Task)
//   async addTask(@Arg("data", () => TaskInput) task: TaskInput): Promise<Task> {
//     const newTask = this.taskRepo.create(task);
//     await newTask.save();
//     return newTask;
//   }

//   // delete task
//   @Authorized()
//   @Mutation(() => Boolean)
//   async deleteTask(@Arg("id", () => ID) id: number): Promise<Boolean> {
//     const task = await this.taskRepo.findOne(id);
//     if (task) {
//       await task.remove();
//       return true;
//     }
//     return false;
//   }

//   // update task
//   @Authorized()
//   @Mutation(() => Task)
//   async updateTask(
//     @Arg("id", () => ID) id: number,
//     @Arg("subject") subject: string,
//     @Arg("description") description: string,
//     @Arg("totalTimeSpent") totalTimeSpent: number,
//     @Arg("progress") progress: number,
//     @Arg("dueDate") dueDate: Date,
//     @Arg("initialTimeSpentEstimated") initialTimeSpentEstimated: number
//   ): Promise<Task | null> {
//     const task = await this.taskRepo.findOne(id);
//     if (task) {
//       Object.assign(task, {
//         subject,
//         description,
//         totalTimeSpent,
//         progress,
//         dueDate,
//         initialTimeSpentEstimated,
//       });
//       await task.save();
//       return task;
//     } else {
//       return null;
//     }
//   }
// }
