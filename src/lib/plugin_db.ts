import { Context, Next } from 'hono';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js'; 

const connection = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: Bun.env.senha_db,
  database: 'Task_manager',
});

export const db = drizzle(connection, { schema, mode: 'default' });

export type Bindings = {
  db: typeof db;
};

export const dbProvider = async (c: Context<{ Variables: Bindings }>, next: Next) => {
  c.set('db', db);
  await next();
};