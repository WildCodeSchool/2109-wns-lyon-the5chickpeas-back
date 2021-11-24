import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "../models/User";
import * as argon2 from "argon2";

@Resolver(User)
export class UsersResolver {
  private userRepo = getRepository(User);

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await this.userRepo.find();
  }

  // Update user
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    // TODO
    return null;
  }

  // Delete user
  @Mutation(() => User)
  async deleteUser(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const user = await this.userRepo.findOne({ id });
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
    @Arg("password") password: string
  ): Promise<User> {
    // Check if a user exists with this email
    const user = await this.userRepo.findOne({ email });
    if (user) throw new Error("A user already exists with this email"); // Faire la traduction 'Un utilisateur existe déjà avec cet adresse email !'

    // TODO : Generate JWT Token

    // Save in DB
    const newUser = this.userRepo.create({
      email,
      password: await argon2.hash(password),
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
