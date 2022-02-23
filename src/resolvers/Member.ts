import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Member } from "../models/Member";

@Resolver(Member)
export class MemberResolver {
  private memberRepo = getRepository(Member);

  @Query(() => [Member])
  async getMembers(): Promise<Member[]> {
    return await this.memberRepo.find();
  }

  @Query(() => Member)
  async getMember(
    @Arg("id", () => ID) id: number
  ): Promise<Member | undefined> {
    return await this.memberRepo.findOne(id);
  }

  // create member
  @Mutation(() => Member)
  async addMember(
    @Arg("data", () => AssetInput) asset: AssetInput
  ): Promise<Member> {
    const newMember = this.memberRepo.create(asset);
    await newMember.save();
    return newMember;
  }

  // delete member
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
