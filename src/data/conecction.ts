// src\data\conecction.ts
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';

dotenv.config();



declare module 'fastify' {
  interface FastifyInstance {
    db: any;
  }
}

const dbPlugin: FastifyPluginAsync = async (app, options) => {
    await app.register(fastifyPostgres, {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.SENHA_DB,
        database: process.env.DB_NAME,
        ssl: false 
    });

    app.decorate('db', app.pg);
}

export default fp(dbPlugin);