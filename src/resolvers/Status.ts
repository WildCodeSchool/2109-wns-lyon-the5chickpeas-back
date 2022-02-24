import { Arg, ID, Mutation, Authorized, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Status, StatusInput } from "../models/Status";

@Resolver(Status)
export class StatusResolver {
  private statusRepo = getRepository(Status);

  @Authorized()
  @Query(() => [Status])
  async getStatus(): Promise<Status[]> {
    return await this.statusRepo.find();
  }

  @Authorized()
  @Mutation(() => Status)
  async addStatus(
    @Arg("data", () => StatusInput) status: StatusInput
  ): Promise<Status> {
    const newStatus = this.statusRepo.create(status);
    await newStatus.save();
    return newStatus;
  }

  //delete status
  @Authorized()
  @Mutation(() => Boolean)
  async deleteStatus(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const status = await this.statusRepo.findOne(id);
    if (status) {
      await status.remove();
      return true;
    }
    return false;
  }

  //update status
  @Authorized()
  @Mutation(() => Status)
  async updateStatus(
    @Arg("id", () => ID) id: number,
    @Arg("name") name: string
  ): Promise<Status | null> {
    const status = await this.statusRepo.findOne({ id });
    if (status) {
      if (status.name) {
        status.name = name;
      }
      await status.save();
      return status;
    } else {
      return null;
    }
  }
}
