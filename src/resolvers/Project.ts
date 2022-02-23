import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository, createQueryBuilder } from "typeorm";
import { Project, ProjectInput } from "../models/Project";
import { Task } from "../models/Task";
import { Member } from "../models/Member";
import { Manager } from "../models/Manager";

@Resolver(Project)
export class ProjectResolver {
  private projectRepo = getRepository(Project);

  @Query(() => [Project])
  async getProjects(): Promise<Project[]> {
    return await this.projectRepo.find();
  }

  // get one project
  @Query(() => Project)
  async getProject(
    @Arg("id", () => ID) id: number
  ): Promise<Project | undefined> {
    return await this.projectRepo.findOne(id);
  }

  // create project
  @Mutation(() => Project)
  async addProject(
    @Arg("data", () => ProjectInput) project: ProjectInput
  ): Promise<Project> {
    const newProject = this.projectRepo.create(project);
    await newProject.save();
    return newProject;
  }

  //update project
  @Mutation(() => Project)
  async updateProject(
    @Arg("id", () => ID) id: number,
    @Arg("name") subject: string,
    @Arg("description") description: string,
    @Arg("estimatedTime") estimatedTime: number,
    @Arg("status") status: string,
    @Arg("dueDate") dueDate: Date,
    @Arg("tasks") tasks: Task[],
    @Arg("managers") managers: Manager[],
    @Arg("members") members: Member[]
  ): Promise<Project | null> {
    const project = await this.projectRepo.findOne(id);
    if (project) {
      Object.assign(project, {
        subject,
        description,
        estimatedTime,
        status,
        dueDate,
        tasks,
        managers,
        members,
      });
      await project.save();
      return project;
    } else {
      return null;
    }
  }

  // delete project
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
