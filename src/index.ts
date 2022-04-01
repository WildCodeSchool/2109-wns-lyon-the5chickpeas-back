import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/User";
import { RolesResolver } from "./resolvers/Role";
import { AssetsResolver } from "./resolvers/Asset";
import { CommentsResolver } from "./resolvers/Comment";
import { NotificationsResolver } from "./resolvers/Notification";
import { ProjectsResolver } from "./resolvers/Project";
import { StatusResolver } from "./resolvers/Status";
import { TasksResolver } from "./resolvers/Task";
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { customAuthChecker } from "./auth";

const main = async () => {
  createConnection({
    type: "mysql",
    host: "db",
    port: 3306,
    username: "root",
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [__dirname + "/models/*.ts"],
    synchronize: true,
    logging: false,
  })
    .then(async (connection) => {
      console.log("tu es un bon...");
    })
    .catch((error) => console.log(error));

  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      RolesResolver,
      AssetsResolver,
      CommentsResolver,
      NotificationsResolver,
      ProjectsResolver,
      StatusResolver,
      TasksResolver,
    ],
    authChecker: customAuthChecker,
  });

  // Create the GraphQL server
  // send the tokenin the header
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        token: req.headers.authorization,
        userAgent: req.headers["user-agent"],
        user: null,
      };
    },
  });

  // Start the server
  const { url } = await server.listen(process.env.port || 3000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
};

main().catch((err) => {
  console.log(err);
});
