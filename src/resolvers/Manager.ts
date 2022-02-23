import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Manager } from "../models/Manager";

@Resolver(Manager)
export class ManagerResolver {
  private managerRepo = getRepository(Manager);

  @Query(() => [Manager])
  async getManagers(): Promise<Manager[]> {
    return await this.managerRepo.find();
  }

  @Query(() => Manager)
  async getManager(
    @Arg("id", () => ID) id: number
  ): Promise<Manager | undefined> {
    return await this.managerRepo.findOne(id);
  }

  // create manager
  @Mutation(() => Manager)
  async addManager(
    @Arg("data", () => AssetInput) asset: AssetInput
  ): Promise<Asset> {
    const newAsset = this.assetRepo.create(asset);
    await newAsset.save();
    return newAsset;
  }

  // delete manager
  @Mutation(() => Boolean)
  async deleteManager(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const manager = await this.managerRepo.findOne(id);
    if (manager) {
      await manager.remove();
      return true;
    }
    return false;
  }
}
