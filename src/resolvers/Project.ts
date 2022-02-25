import {
  Arg,
  ID,
  Mutation,
  Authorized,
  Query,
  Resolver,
  Ctx,
} from "type-graphql";
import { getRepository, createQueryBuilder } from "typeorm";
import { Project, ProjectInput } from "../models/Project";
import { Task, TaskInput } from "../models/Task";
import { User } from "../models/User";

@Resolver(Project)
export class ProjectsResolver {
  private projectRepo = getRepository(Project);
  private userRepo = getRepository(User);
  //private managerRepo = getRepository(Manager);

  @Authorized()
  @Query(() => [Project])
  async getProjects(): Promise<Project[]> {
    return await this.projectRepo.find();
  }

  // get one project
  @Authorized()
  @Query(() => Project)
  async getProject(
    @Arg("id", () => ID) id: number
  ): Promise<Project | undefined> {
    return await this.projectRepo.findOne(id);
  }

  // create project
  @Authorized()
  @Mutation(() => Project)
  async addProject(
    @Arg("data", () => ProjectInput) project: ProjectInput,
    @Ctx() context: { token: string; userAgent: string; user: User | null }
  ): Promise<Project> {
    // console.log(ctx.user.id)
    const newProject = this.projectRepo.create(project);
    const currentUser: User | null = context.user;
    // const existingManager = await this.managerRepo.findOne(currentUser?.id);
    // if (!existingManager) {
    //   const manager: Manager = this.managerRepo.create({
    //     projects: [],
    //     user: currentUser as User,
    //   });
    //   manager.save();
    newProject.managers = [currentUser as User];
    await newProject.save();

    return newProject;
  }

  //update project
  @Authorized()
  @Mutation(() => Project)
  async updateProject(
    @Arg("id", () => ID) id: number,
    @Arg("name") subject: string,
    @Arg("description") description: string,
    @Arg("estimatedTime") estimatedTime: number,
    @Arg("status") status: string,
    @Arg("dueDate") dueDate: string,
    @Arg("tasks", () => [Number]) tasksIds: number[]
    // @Arg("managers", () => [Number]) managersIds: number[],
    // @Arg("members", () => [Number]) membersIds: number[]
  ): Promise<Project | null> {
    const project = await this.projectRepo.findOne(id);
    if (project) {
      Object.assign(project, {
        subject,
        description,
        estimatedTime,
        status,
        dueDate,
        //tasks,
        //managers,
        //members,
      });
      await project.save();
      return project;
    } else {
      return null;
    }
  }

  // delete project
  @Authorized()
  @Mutation(() => Boolean)
  async deleteProject(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const project = await this.projectRepo.findOne(id);
    if (project) {
      await project.remove();
      return true;
    }
    return false;
  }
}
