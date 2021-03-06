import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "../models/User";
import * as argon2 from "argon2";
import { sendTokenNewUser } from "../services/email/tokenAccountValidation";
import { sendRefreshToken } from "../services/email/newTokenAccountValidation";
const jwt = require("jsonwebtoken");
import { Role } from "../models/Role";

@Resolver(User)
export class UsersResolver {
  private userRepo = getRepository(User);
  private roleRepo = getRepository(Role);

  // Validate account
  @Mutation(() => String)
  async validateAccount(
    @Arg("validAccountToken") validAccountToken: string
  ): Promise<string> {
    const user = await this.userRepo.findOne({ validAccountToken });

    // Flash Bagthrow new Error('The provided token is linked to no user');
    if (!user) return "Invalid token"; //throw new Error('The provided token is linked to no user'); ;

    try {
      const isTokenValid = jwt.verify(validAccountToken, `${user.email}`);
      user.validAccountToken = "";
      user.save();

      // Flash blag : Your account has been successfully confirmed. You can now logged in
      return "Account validated";
    } catch (error) {
      // Regenerate Token
      const token = jwt.sign({ user: "newUser" }, `${user.email}`, {
        expiresIn: "120s",
      });

      user.validAccountToken = token;
      user.save();
      sendRefreshToken(token, user);

      // Flash blag : A new email has been sent to your email account
      return "Expired token";
    }
  }

  // Get all users
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
    @Arg("pseudo") pseudo: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("validAccountToken") validAccountToken: string
  ): Promise<User | Boolean> {
    // Check if a user exists with this email
    const user = await this.userRepo.findOne({ email });
    if (user) throw new Error("A user already exists with this email"); // Faire la traduction 'Un utilisateur existe d??j?? avec cet adresse email !'

    let role = await this.roleRepo.findOne({ name: "ROLE_USER" });
    if (!role) {
      const newRole = this.roleRepo.create({ name: "ROLE_USER" });
      newRole.save();
      role = newRole;
    }

    // Generate token
    const token = jwt.sign({ user: "newUser" }, `${email}`, {
      expiresIn: "600s",
    });

    // Save in DB
    const newUser = this.userRepo.create({
      email,
      password: await argon2.hash(password),
      pseudo,
      roles: [role],
      validAccountToken: token,
    });
    await newUser.save();
    sendTokenNewUser(token, newUser);

    return newUser;
  }

  // Existing user
  @Mutation(() => String, { nullable: true })
  async signin(
    @Arg("pseudo") pseudo: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("validAccountToken") validAccountToken: string
  ): Promise<string> {
    const user = await this.userRepo.findOne({ email });

    if (user) {
      if (user.validAccountToken === "") {
        return "Connected...";
      }

      try {
        const isTokenValid = jwt.verify(validAccountToken, `${user.email}`);
        console.log("it works");
      } catch (error) {
        return "Expired token...";
      }

      return "Account not validated yet...";
    }

    return "No user found for those credentials";
  }
}
