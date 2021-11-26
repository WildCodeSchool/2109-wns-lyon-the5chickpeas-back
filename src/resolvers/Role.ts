import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Role, RoleInput } from "../models/Role";

@Resolver(Role)
export class RolesResolver {
  private roleRepo = getRepository(Role);

  @Query(() => [Role])
  async getRoles(): Promise<Role[]> {
    return await this.roleRepo.find();
  }

  @Mutation(() => Role)
  async addRole(@Arg("data", () => RoleInput) role: RoleInput): Promise<Role> {
    const newRole = this.roleRepo.create(role);
    await newRole.save();
    return newRole;
  }

  //delete role
  @Mutation(() => Boolean)
  async deleteRole(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const role = await this.roleRepo.findOne(id);
    if (role) {
      await role.remove();
      return true;
    }
    return false;
  }

  //update role
  @Mutation(() => Role)
  async updateRole(
    @Arg("id", () => ID) id: number,
    @Arg("name") name: string
  ): Promise<Role | null> {
    const role = await this.roleRepo.findOne({ id });
    if (role) {
      if (role.name) {
        role.name = name;
      }
      await role.save();
      return role;
    } else {
      return null;
    }
  }
}
