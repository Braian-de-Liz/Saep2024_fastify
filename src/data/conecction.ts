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