import { Arg, ID, Mutation, Authorized, Query, Resolver } from "type-graphql";
import { getRepository, createQueryBuilder } from "typeorm";
import { Notification, NotificationInput } from "../models/Notification";

@Resolver(Notification)
export class NotificationsResolver {
  private notificationRepo = getRepository(Notification);

  @Authorized()
  @Query(() => [Notification])
  async getNotifications(): Promise<Notification[]> {
    return await this.notificationRepo
      .createQueryBuilder("notification")
      .limit(10)
      .getMany();
  }

  // get one notification
  @Authorized()
  @Query(() => Notification)
  async getNotification(
    @Arg("id", () => ID) id: number
  ): Promise<Notification | undefined> {
    return await this.notificationRepo.findOne(id);
  }

  // create notification
  @Authorized()
  @Mutation(() => Notification)
  async addNotification(
    @Arg("data", () => NotificationInput) notification: NotificationInput
  ): Promise<Notification> {
    const newNotification = this.notificationRepo.create(notification);
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
  }
}
