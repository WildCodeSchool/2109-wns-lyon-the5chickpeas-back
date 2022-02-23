import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Asset, AssetInput } from "../models/Asset";

@Resolver(Asset)
export class AssetResolver {
    private assetRepo = getRepository(Asset);

    // get all assets
    @Query(() => [Asset])
    async getAssets(): Promise<Asset[]> {
        return await this.assetRepo.find();
    }

    // get one asset
    @Query(() => Asset)
    async getAsset(@Arg("id", () => ID) id: number): Promise<Asset | undefined> {
        return await this.assetRepo.findOne(id);
    }

    // create asset
    @Mutation(() => Asset)
    async addAsset(@Arg("data", () => AssetInput) asset: AssetInput):
    Promise<Asset> {
        const newAsset = this.assetRepo.create(asset);
        await newAsset.save();
        return newAsset;
    }

    // delete asset
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