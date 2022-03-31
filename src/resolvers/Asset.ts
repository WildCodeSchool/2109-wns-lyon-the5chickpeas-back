import { Arg, ID, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Asset, AssetInput } from "../models/Asset";

@Resolver(Asset)
export class AssetsResolver {
  private assetRepo = getRepository(Asset);

  @Authorized()
  @Query(() => [Asset])
  async getAssets(): Promise<Asset[]> {
    return await this.assetRepo.find();
  }

  // get one asset
  @Authorized()
  @Query(() => Asset)
  async getAsset(@Arg("id", () => ID) id: number): Promise<Asset | undefined> {
    return await this.assetRepo.findOne(id);
  }

  // create asset
  @Authorized()
  @Mutation(() => Asset)
  async addAsset(
    @Arg("data", () => AssetInput) asset: AssetInput
  ): Promise<Asset> {
    const newAsset = this.assetRepo.create(asset);
    await newAsset.save();
    return newAsset;
  }

  // delete asset
  @Authorized()
  @Mutation(() => Boolean)
  async deleteAsset(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const asset = await this.assetRepo.findOne(id);
    if (asset) {
      await asset.remove();
      return true;
    }
    return false;
  }
}
