import fastify from "fastify";
import type { FastifyInstance } from "fastify";
import cors from '@fastify/cors';

import insertTask from './routes/routs_tasks/salvar_Task.js';
import cadastarr_user  from './routes/routs_user/user_cadastro.js';

const aplicacao: FastifyInstance = fastify({ logger: true });

await aplicacao.register(cors, {
    origin: true
});

await aplicacao.register(insertTask, { prefix: '/api' });
await aplicacao.register(cadastarr_user, { prefix: '/api' });

aplicacao.listen({ port: 3220, host: '0.0.0.0' }, () => {
    console.log("Fastify rodando na porta 3220");
});
