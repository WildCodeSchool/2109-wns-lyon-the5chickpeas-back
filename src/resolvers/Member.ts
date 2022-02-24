import { Arg, ID, Mutation, Query, Resolver, Authorized } from "type-graphql";
import { getRepository } from "typeorm";
import { AssetInput } from "../models/Asset";
import { Member } from "../models/Member";

@Resolver(Member)
export class MembersResolver {
  private memberRepo = getRepository(Member);

  @Authorized()
  @Query(() => [Member])
  async getMembers(): Promise<Member[]> {
    return await this.memberRepo.find();
  }

  @Authorized()
  @Query(() => Member)
  async getMember(
    @Arg("id", () => ID) id: number
  ): Promise<Member | undefined> {
    return await this.memberRepo.findOne(id);
  }

  // create member
  // @Mutation(() => Member)
  // @Authorized()
  // async addMember(
  //   @Arg("data", () => AssetInput) asset: AssetInput
  // ): Promise<Member> {
  //   const newMember = this.memberRepo.create(asset);
  //   await newMember.save();
  //   return newMember;
  // }

  // delete member
  @Authorized()
  @Mutation(() => Boolean)
  async deleteMember(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const member = await this.memberRepo.findOne(id);
    if (member) {
      await member.remove();
      return true;
    }
    return false;
  }
}
