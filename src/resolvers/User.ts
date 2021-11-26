import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "../models/User";
import * as argon2 from "argon2";
import { Role } from "../models/Role";

@Resolver(User)
export class UsersResolver {
  private userRepo = getRepository(User);
  private roleRepo = getRepository(Role);

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await this.userRepo.find({ relations: ["roles"] });
  }

  // update user
  @Mutation(() => User)
  async updateUser(
    @Arg("id", () => ID) id: number,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("pseudo") pseudo: string
  ): Promise<User | null> {
    const user = await this.userRepo.findOne(id);
    if (user) {
      Object.assign(user, { email, password: argon2.hash(password), pseudo });
      await user.save();
      return user;
    } else {
      return null;
    }
  }

  // Delete user
  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const user = await this.userRepo.findOne(id);
    if (user) {
      await user.remove();
      return true;
    }
    return false;
  }

  // Non-existing user
  @Mutation(() => User)
  async signup(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("pseudo") pseudo: string
  ): Promise<User> {
    // Check if a user exists with this email
    const user = await this.userRepo.findOne({ email });
    if (user) throw new Error("A user already exists with this email"); // Faire la traduction 'Un utilisateur existe déjà avec cet adresse email !'

    let role = await this.roleRepo.findOne({ name: "ROLE_USER" });
    if (!role) {
      const newRole = this.roleRepo.create({ name: "ROLE_USER" });
      newRole.save();
      role = newRole;
    }

    // TODO : Generate JWT Token

    // Save in DB
    const newUser = this.userRepo.create({
      email,
      password: await argon2.hash(password),
      pseudo,
      roles: [role],
    });
    await newUser.save();
    return newUser;
  }

  // Existing user
  @Mutation(() => User, { nullable: true })
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    const user = await this.userRepo.findOne({ email });

    if (user) {
      if (await argon2.verify(user.password, password)) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
