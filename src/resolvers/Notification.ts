import { Arg, ID, Mutation, Authorized, Query, Resolver, Ctx } from "type-graphql";
import { getRepository, createQueryBuilder } from "typeorm";
import { Notification, NotificationInput } from "../models/Notification";
import { Comment } from "../models/Comment";
import { User } from "../models/User";

@Resolver(Notification)
export class NotificationsResolver {
  private notificationRepo = getRepository(Notification);
  private commentRepo = getRepository(Comment);

  @Authorized()
  @Query(() => [Notification])
  async getNotifications(): Promise<Notification[]> {
    return await this.notificationRepo.find({ relations: ["user"] })
  }

  // Get notif of a user
  @Authorized()
  @Query(() => [Notification])
  async getNotificationsOfOneUser(
    @Ctx() context : {user : User} // @Ctx décorateur 
  ): Promise<Notification[]> {
    return await this.notificationRepo.find({
      where: {
          user: { id: context.user.id},
          read: false
      },
      relations: ["user"],
    }); 
  }

   // Mettre une notification en => LUE
   @Authorized()
   @Mutation(() => Notification)
   async readedNotification(
     @Arg("id", () => ID) id: number
   ): Promise<Notification | undefined> {
      const notification = await this.notificationRepo.findOne(id);

      if(!notification){
        // Throw Error => Pas de notifications trouvé à cet ID
      }

      const date = new Date();

      notification.read_at = date.toDateString();
      notification.read = true;
      notification.save();

      return notification;
   }

  /*// get one notification
  @Authorized()
  @Query(() => Notification)
  async getNotification(
    @Arg("id", () => ID) id: number
  ): Promise<Notification | undefined> {
    return await this.notificationRepo.findOne(id);
  }*/

  /*// create notification
  @Authorized()
  @Mutation(() => Notification)
  async addNotification(
    @Arg("data", () => NotificationInput) notification: NotificationInput,
    @Arg("commentId") commentId: number,
    @Ctx()
    context: {
      token: string;
      userAgent: string;
      user: User | null;
    }
  ): Promise<Notification> {
    const newNotification = this.notificationRepo.create(notification);
    const currentUser: User | null = context.user;
    const comment = await this.commentRepo.findOne(commentId);
    
    newNotification.user = currentUser as User;
    newNotification.comment = comment as Comment;
    await newNotification.save();
    return newNotification;
  }

  // delete notification
  @Authorized()
  @Mutation(() => Boolean)
  async deleteNotification(@Arg("id", () => ID) id: number): Promise<Boolean> {
    const notification = await this.notificationRepo.findOne(id);
    if (notification) {
      await notification.remove();
      return true;
    }
    return false;
  }*/
}
