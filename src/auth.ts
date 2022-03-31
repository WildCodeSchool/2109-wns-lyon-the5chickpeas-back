const jwt = require("jsonwebtoken");
import { getRepository } from "typeorm";
import { isContext } from "vm";
import { User } from "./models/User";

export const customAuthChecker = async ({
  root,
  args,
  context,
  info,
}: {
  root: any;
  args: any;
  context: any;
  info: any;
}) => {
  //get the current user
  const userRepo = getRepository(User);
  //give the token to the context
  const userJwt = context.token;

  try {
    //check if the token is valid / database
    const decoded = jwt.verify(userJwt, "supersecret");
    //if not
    if (!decoded.userId) {
      return false;
    }
    //if valid, then find the specific user with id
    const user = await userRepo.findOne(decoded.userId);
    if (!user) {
      return false;
    }
    //get user from context
    context.user = user;
    return true;
  } catch (err) {
    return false;
  }
};
