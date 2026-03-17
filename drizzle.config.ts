import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/schema.ts', 
  out: './drizzle',             
  dialect: 'mysql',             
  dbCredentials: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password:  process.env.senha_db,
    database: 'Task_manager',
  },
});