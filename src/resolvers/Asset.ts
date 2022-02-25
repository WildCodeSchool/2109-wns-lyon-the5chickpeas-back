// import { Arg, ID, Authorized, Mutation, Query, Resolver } from "type-graphql";
// import { getRepository } from "typeorm";
// import { Asset, AssetInput } from "../models/Asset";
// import { Task } from "../models/Task";

// @Resolver(Asset)
// export class AssetsResolver {
//   private assetRepo = getRepository(Asset);
//   private taskRepo = getRepository(Task);

//   @Authorized()
//   @Query(() => [Asset])
//   async getAssets(): Promise<Asset[]> {
//     return await this.assetRepo.find();
//   }

//   // get one asset
//   @Authorized()
//   @Query(() => Asset)
//   async getAsset(@Arg("id", () => ID) id: number): Promise<Asset | undefined> {
//     return await this.assetRepo.findOne(id);
//   }

//   // create asset
//   @Authorized()
//   @Mutation(() => Asset)
//   async addAsset(
//     @Arg("data", () => AssetInput) asset: AssetInput,
//     // @Arg("taskId") taskId: number
//   ): Promise<Asset | null> {
//     try {
//       const newAsset = this.assetRepo.create(asset);
//       // const task = this.taskRepo.findOne(taskId);
//       // console.log(task);
//       // newAsset.task = task;
//       await newAsset.save();
//       return newAsset;
//     } catch (err) {
//       console.log(err);
//       return null
//     }
//   }

//   // delete asset
//   @Authorized()
//   @Mutation(() => Boolean)
//   async deleteAsset(@Arg("id", () => ID) id: number): Promise<Boolean> {
//     const asset = await this.assetRepo.findOne(id);
//     if (asset) {
//       await asset.remove();
//       return true;
//     }
//     return false;
//   }
// }
