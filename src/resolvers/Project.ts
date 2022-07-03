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
import { Project, ProjectInput } from "../models/Project";
import { Status } from "../models/Status";
import { Task, TaskInput } from "../models/Task";
import { User } from "../models/User";
import { Notification } from '../models/Notification';

@Resolver(Project)
export class ProjectsResolver {
  private projectRepo = getRepository(Project);
  private userRepo = getRepository(User);
  private statusRepo = getRepository(Status);
  private notificationRepo = getRepository(Notification);

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
    
    // Creation du projet
    const newProject = this.projectRepo.create(project);

    const currentUser: User | null = context.user;

    newProject.managers = [currentUser as User];
    const status = await this.statusRepo.findOne({ code: 0 });
    newProject.status = status as Status;

    // Persist du projet
    await newProject.save();

    // Add a notification => Chercher les membres et faire une boucle FOR sur eux

    // Creation de la notification
    const newNotification = this.notificationRepo.create();
    const date = new Date();
    
    // Affectation des valeurs
    newNotification.name = '';
    newNotification.read = false;
    newNotification.created_at = date.toDateString();
    newNotification.user = currentUser as User;

    // Persist de la notification
    await newNotification.save();

    //console.log(newNotification);

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
    @Arg("managersIds", () => [Number]) managersIds: number
  ): Promise<Project | null> {
    const project = await this.projectRepo.findOne(id);
    const status = await this.statusRepo.findOne(statusId);
    if (project) {
      Object.assign(project, {
        name,
        description,
        estimatedTime,
        status,
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
  ): Promise<Project> {
    // checked if project exists
    const project = await this.projectRepo.findOne(id);
    if (!project) {
      throw new Error("project not found");
    }
    // check if manager already exists
    // manager to be added
    const managerFound = await this.userRepo.findOne(managersId);
    if (!managerFound) {
      throw new Error("manager not found");
    }

    // //check if the managerFoundId already exists
    project.managers.map((manager) => {
      if (manager.id === managersId) {
        throw new Error("manager already exists");
      }
    });

    project.managers.push(managerFound);
    project.save();
    return project;
  }

  //delete managerFromProject
  @Authorized()
  @Mutation(() => Project)
  async deleteManagerToProject(
    @Arg("id", () => ID) id: number,
    @Arg("managersId") managersId: number
  ): Promise<Project | string> {
    // checked if project exists
    const project = await this.projectRepo.findOne(id);
    if (!project) {
      return "project not found";
    }

    // delete manager
    project.managers = project.managers.filter(
      (manager) => manager.id != managersId
    );

    project.save();
    return project;
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
