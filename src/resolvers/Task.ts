import {
  Arg,
  ID,
  Mutation,
  Authorized,
  Query,
  Resolver,
  Ctx,
} from "type-graphql";
import { getRepository } from "typeorm";
import { Task, TaskInput } from "../models/Task";
import { User } from "../models/User";
import { Status } from "../models/Status";
import { Project } from "../models/Project";

@Resolver(Task)
export class TasksResolver {
  private taskRepo = getRepository(Task);
  private userRepo = getRepository(User);
  private statusRepo = getRepository(Status);
  private projectRepo = getRepository(Project);

  // get all tasks
  @Authorized()
  @Query(() => [Task])
  async getTasks(): Promise<Task[]> {
    return await this.taskRepo.find({ relations: ["users"] });
  }

  // get one task
  @Authorized()
  @Query(() => Task)
  async getTask(@Arg("id", () => ID) id: number): Promise<Task | undefined> {
    return await this.taskRepo.findOne(id);
  }

  //add Task
  @Authorized()
  @Mutation(() => Task)
  async addTask(
    @Arg("projectId") ProjectId: number,
    @Arg("data", () => TaskInput) task: TaskInput,
    @Ctx()
    context: {
      token: string;
      userAgent: string;
      user: User | null;
    }
  ): Promise<Task> {
    const currentUser: User | null = context.user;
    const newTask = this.taskRepo.create(task);
    const status = await this.statusRepo.findOne({ name: "To do" });
    const project = await this.projectRepo.findOne(ProjectId);

    newTask.status = status as Status;
    newTask.project = project as Project;
    newTask.users = [currentUser as User];

    await newTask.save();
    return newTask;
  }
  // delete task
  @Authorized()
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
  @Authorized()
  @Mutation(() => Task)
  async updateTask(
    @Arg("id", () => ID) id: number,
    @Arg("subject") subject: string,
    @Arg("description") description: string,
    @Arg("totalTimeSpent") totalTimeSpent: number,
    @Arg("progress") progress: number,
    @Arg("dueDate") dueDate: string,
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

  // assign a task to a user
  @Authorized()
  @Mutation(() => Task)
  async assignUserToTask(
    @Arg("id", () => ID) id: number,
    @Arg("userId") userId: number
  ): Promise<Task> {
    // check if task exists
    const task = await this.taskRepo.findOne(id, { relations: ["users"] });
    if (!task) {
      throw new Error("task not found");
    }
    // check if user already exists
    // user to be added
    const userFound = await this.userRepo.findOne(userId);
    if (!userFound) {
      throw new Error("user not found");
    }

    //check userFoundId already exists
    task.users?.map((user) => {
      if (user.id === userId) {
        throw new Error("user already exists");
      }
    });

    task.users?.push(userFound);
    task.save();
    return task;
  }

  //delete userFromTask
  @Authorized()
  @Mutation(() => Task)
  async deleteUserToTask(
    @Arg("id", () => ID) id: number,
    @Arg("userId", () => ID) userId: number
  ): Promise<Task> {
    // checked if task exists
    const task = await this.taskRepo.findOne(id, { relations: ["users"] });
    if (!task) {
      throw new Error("task not found");
    }

    // mettre à jour la liste des user
    task.users = task.users?.filter((user) => user.id != userId);

    await task.save();
    return task;
  }
}
