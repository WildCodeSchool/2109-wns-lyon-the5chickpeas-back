import { Arg, ID, Mutation, Authorized, Query, Resolver } from "type-graphql";
import { getRepository, createQueryBuilder } from "typeorm";
import { Project, ProjectInput } from "../models/Project";
import { Task, TaskInput } from "../models/Task";
import { Manager } from "../models/Manager";
import { User } from "../models/User";
import { Member } from "../models/Member";

@Resolver(Project)
export class ProjectsResolver {
  private projectRepo = getRepository(Project);
  private userRepo = getRepository(User);
  private managerRepo = getRepository(Manager);

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
    @Arg("userId", () => ID) id: number
  ): Promise<Project> {
    // console.log(ctx.user.id)
    const newProject = project;
    newProject.createdDate = new Date();
    // if(!project.dateLimit) {
    //   newProject.dateLimit = new Date();
    // }
    // if(!project.estimatedTime) {
    //   newProject.estimatedTime = 0;
    // }
    const projectSaved = this.projectRepo.create(project).save();
    const manager: User | undefined = await this.userRepo.findOne({where: {id}});
    if (manager) {
      await this.managerRepo.create(manager).save();
    }
    return projectSaved;
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
    @Arg("tasks", () => [Number]) tasksIds: number[],
    @Arg("managers", () => [Number]) managersIds: number[],
    @Arg("members", () => [Number]) membersIds: number[]
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
