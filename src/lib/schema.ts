import { mysqlTable, serial, varchar, int, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

const users = mysqlTable("users", {
    id: serial('id').primaryKey().notNull(),
    nome: varchar("nome", { length: 87 }).notNull(),
    senha: varchar("senha", {length: 14}).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique()
});

const tasks = mysqlTable("tasks", {
    id: serial('id_task').primaryKey().notNull(),
    usuarioId: int('id_usuario').notNull().references(() => users.id),
    descricao: varchar('descricao_tarefa', { length: 255 }).notNull(),
    setor: varchar('nome_setor', { length: 100 }).notNull(),
    prioridade: mysqlEnum('prioridade', ['baixa', 'média', 'alta']).notNull(),
    dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
    status: mysqlEnum('status', ['a fazer', 'fazendo', 'pronto']).default('a fazer').notNull(),
});

export { users, tasks };