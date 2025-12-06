// src\data\conecction.ts
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Pool } from 'pg';
import dotenv from 'dotenv'

dotenv.config();



declare module 'fastify' {
  interface FastifyInstance {
    db: Pool;
  }
}

const dbPlugin: FastifyPluginAsync = async (fastify, options) => {
  
  const pool = new Pool({
    host: "localhost",
    port: 5250, 
    user: "postgres",
    password: process.env.SENHA_DB,
    database: "crud_fastify",
    max: 20,
  });

  try {
    const client = await pool.connect();
    client.release(); 
    fastify.log.info('PostgreSQL conectado com sucesso!');
  } catch (erro) {
    fastify.log.error('Erro fatal ao conectar no banco' + erro);
    throw erro; 
  }

  fastify.decorate('db', pool);

  fastify.addHook('onClose', async (instance) => {
    await instance.db.end();
    console.log('Pool de conexões fechado.');
  });
};

export default fp(dbPlugin);