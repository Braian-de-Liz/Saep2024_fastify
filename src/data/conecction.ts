// src/data/conecction.ts 
import { Pool } from "pg";
import { PoolClient } from 'pg';
import dotenv from 'dotenv'

dotenv.config();
const SENHA_DB = process.env.SENHA_DB;
if (!SENHA_DB) {

    console.error("Erro: A variável de ambiente SENHA_DB não está definida.");
    throw new Error("Configuração de banco de dados incompleta.");
}

async function connectar(): Promise<Pool> {
    const conexao: Pool = new Pool({
        host: "localhost",
        port: 5250,
        user: "postgres",
        password: SENHA_DB,
        database: "crud_fastify",
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    let client: PoolClient | undefined;

    try {
        client = await conexao.connect();
        console.log('Conectado ao PostgreSQL!');
        client.release();
        return conexao;
    } catch (erro) {
        const error = erro as Error;
        console.error('Erro ao conectar no banco:', error.message);
        throw error;
    }
}

export { connectar };


/* 
// src/plugins/db.ts
import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 1. Defina o que você está injetando (Decorando)
// Isso garante que o TS saiba que 'db' existe na instância.
declare module 'fastify' {
  interface FastifyInstance {
    db: Pool;
  }
}

// 2. O Plugin Assíncrono (FastifyPluginAsync)
const dbConnectorPlugin: FastifyPluginAsync = async (fastify, options) => {
    const SENHA_DB = process.env.SENHA_DB;

    if (!SENHA_DB) {
        throw new Error("Erro de Configuração: SENHA_DB não definida.");
    }

    // 3. Criação do Pool: SOMENTE AQUI, uma única vez.
    const pool = new Pool({
        host: "localhost",
        port: 5432, // Porta 5250 é incomum; 5432 é a padrão do Postgres. Verifique isso.
        user: "postgres",
        password: SENHA_DB,
        database: "crud_fastify",
        max: 20,
    });

    try {
        // Testa a Conexão (opcional, mas bom para fail fast)
        await pool.query('SELECT NOW()'); 
        console.log('Conectado ao PostgreSQL!');
    } catch (erro) {
        const error = erro as Error;
        console.error('Erro ao conectar no banco:', error.message);
        // Garante que o servidor não inicie se o DB falhar
        throw error; 
    }

    // 4. Injeção (Decoração): fastify.decorate()
    fastify.decorate('db', pool);

    // 5. Hook de Fechamento: Garante que o Pool seja encerrado corretamente
    fastify.addHook('onClose', (instance: FastifyInstance) => {
        console.log('Encerrando Pool de Conexões...');
        instance.db.end();
    });
};

export default dbConnectorPlugin;
 */