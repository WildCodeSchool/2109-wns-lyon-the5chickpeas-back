/**
 * Import from installed packages
 */
import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/User";
import { RolesResolver } from "./resolvers/Role";
import { AssetsResolver } from "./resolvers/Asset";
import { CommentsResolver } from "./resolvers/Comment";
// import { ManagersResolver } from "./resolvers/Manager";
// import { MembersResolver } from "./resolvers/Member";
import { NotificationsResolver } from "./resolvers/Notification";
import { ProjectsResolver } from "./resolvers/Project";
import { StatusResolver } from "./resolvers/Status";
import { TasksResolver } from "./resolvers/Task";
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { customAuthChecker } from "./auth";

/**
 * Import from others files
 */

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
      // Code...
      console.log("tu es un bon...");
    })
    .catch((error) => console.log(error));

  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      RolesResolver,
      AssetsResolver,
      CommentsResolver,
      // ManagersResolver,
      // MembersResolver,
      NotificationsResolver,
      ProjectsResolver,
      StatusResolver,
      TasksResolver,
    ],
    authChecker: customAuthChecker,
  });

  // app.use(express.urlencoded({ extended: false }));
  // app.use(cors()); // Allow connection with front end + apply graphql middleware
  // app.use(express.json()); // Parse all HTTP request  in json

  // Middlewares
  /*app.use("/graphql", graphqlHTTP({
        schema,
        graphiql: true
    }));*/

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
