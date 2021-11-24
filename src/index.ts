/**
 * Import from installed packages
*/
//require('dotenv').config();
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';


/**
 * Import from others files
 */

const main = async () => {
    
    await createConnection({
        type: "mysql",
        database: process.env.MYSQL_DATABASE,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        logging: true, // Display logs
        synchronize: false,
        entities: []
    });

    const app = express();

    app.use(express.urlencoded({ extended: false }));
    app.use(cors()); // Allow connection with front end + apply graphql middleware
    app.use(express.json()); // Parse all HTTP request  in json

    // Middlewares 
    /*app.use("/graphql", graphqlHTTP({
        schema,
        graphiql: true
    }));*/

    app.listen(3001, () => {
        console.log("Server running...");
    })

}

main().catch((err) => {
    console.log(err);
})
