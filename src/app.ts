import {ApolloServer, ExpressContext} from 'apollo-server-express'
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectToMongo from './db/connectToMongo'
import Resolvers from './Schema/Resolvers'
import TypeDefs from './Schema/TypeDefs'
import http from 'http';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground, Config } from 'apollo-server-core';

const app = express()
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs: TypeDefs, 
    resolvers: Resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),ApolloServerPluginLandingPageGraphQLPlayground()],
    introspection: true,
    playground: true,
} as Config<ExpressContext>,)

const startServer = async () => {

    await server.start();
    server.applyMiddleware({app})

    const PORT = process.env.PORT
    
    if(process.env.NODE_ENV !== 'test') connectToMongo()
    await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);

    return server
    
} 

startServer()



