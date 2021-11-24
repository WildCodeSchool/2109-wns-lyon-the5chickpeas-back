/**
 * Import from installed packages
*/
//require('dotenv').config();
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import { buildSchema } from 'type-graphql';
import { UsersResolver } from './resolvers/User';
import 'reflect-metadata';
import { ApolloServer } from "apollo-server";


/**
 * Import from others files
 */

const main = async () => {

    // Initialise connection
    await createConnection();

    //const app = express();

    const schema = await buildSchema({
        resolvers: [UsersResolver],
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
   const server = new ApolloServer({
    schema,
    });

    // Start the server
    const { url } = await server.listen(3001);
    console.log(`Server is running, GraphQL Playground available at ${url}`);


}

main().catch((err) => {
    console.log(err);
})
