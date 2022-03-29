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
import { Status } from "../models/Status";
import { Task, TaskInput } from "../models/Task";
import { User } from "../models/User";

@Resolver(Project)
export class ProjectsResolver {
  private projectRepo = getRepository(Project);
  private userRepo = getRepository(User);
  private statusRepo = getRepository(Status);

  @Authorized()
  @Query(() => [Project])
  async getProjects(): Promise<Project[]> {
    return await this.projectRepo.find({ relations: ["status"] });
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
    @Ctx()
    context: {
      token: string;
      userAgent: string;
      user: User | null;
    }
  ): Promise<Project> {
    // console.log(ctx.user.id)
    const newProject = this.projectRepo.create(project);
    const currentUser: User | null = context.user;
    newProject.managers = [currentUser as User];
    const status = await this.statusRepo.findOne({ code: 0 });
    newProject.status = status as Status;
    await newProject.save();

    return newProject;
  }

  //update project
  @Authorized()
  @Mutation(() => Project)
  async updateProject(
    @Arg("id", () => ID) id: number,
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("estimatedTime") estimatedTime: number,
    @Arg("statusId") statusId: number,
    //@Arg("dueDate") dueDate: string
    // @Arg("tasks", () => [Number]) tasksIds: number[],
    @Arg("managersIds", () => [Number]) managersIds: number //TODO: array ?
    //@Arg("members", () => [String]) members: string[] //TODO: array ?
  ): Promise<Project | null> {
    const project = await this.projectRepo.findOne(id);
    const status = await this.statusRepo.findOne(statusId);
    if (project) {
      Object.assign(project, {
        name,
        description,
        estimatedTime,
        status,
        //dueDate,
        //tasksIds,
        //members,
      });
      await project.save();

      return project;
    } else {
      return null;
    }
  }

  @Authorized()
  @Mutation(() => Project)
  async addManagerToProject(
    @Arg("id", () => ID) id: number,
    @Arg("managersId") managersId: number
  ): Promise<Project | string> {
    const project = await this.projectRepo.findOne(id);
    if (!project) {
      return "project not found";
    }
    const managerFound = await this.userRepo.findOne(managersId);
    if (!managerFound) {
      return "manager not found";
    }
    const managerFoundId = managerFound?.id;
    let found = false;

    project.managers.map((manager) => {
      if (manager.id === managerFoundId) {
        found = true;
      }
    });
    if (found) return "already exist";

    project.managers.push(managerFound);
    project.save();
    return project;
  }

  // @Authorized()
  // @Mutation(() => Project)
  // async addManagerToProject(
  //   @Arg("id", () => ID) id: number,
  //   @Arg("managersId") managersId: number
  // ): Promise<Project | null> {
  //   const project = await this.projectRepo.findOne(id);
  //   if (!project) {
  //     return null;
  //   }

  //   try {
  //     const managerFound = await this.userRepo.findOne(managersId);
  //     if (!managerFound) {
  //       return null;
  //     }
  //     const managerFoundId = managerFound?.id;
  //     let found = false;
  //     project.managers.map((manager) => {
  //       if (manager.id === managerFoundId) {
  //         found = true;
  //       }
  //     });
  //     project.managers.push(managerFound);
  //     project.save();
  //     return project;
  //   } catch (err) {
  //     console.log(err);
  //     return null;
  //   }
  // }

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
