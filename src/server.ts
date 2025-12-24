import fastify from "fastify";
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

import db from "./data/conecction.js";
import insertTask from './routes/routs_tasks/salvar_Task.js';
import cadastarr_user from './routes/routs_user/user_cadastro.js';
import user_login from './routes/routs_user/user_login.js';


if (!process.env.JWT_PASSOWORD) {
    console.error("ERRO FATAL: A variável de ambiente JWT_PASSOWORD não foi definida.");
    process.exit(1);
}

const JWT_PASSOWORD: string = process.env.JWT_PASSOWORD

const aplicacao = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();


aplicacao.setValidatorCompiler(validatorCompiler);
aplicacao.setSerializerCompiler(serializerCompiler);


try {
    await aplicacao.register(db);
    await aplicacao.register(cors, { origin: true });
    await aplicacao.register(fastifyJwt, { secret: JWT_PASSOWORD });

    await aplicacao.register(insertTask, { prefix: '/api' });
    await aplicacao.register(cadastarr_user, { prefix: '/api' });
    await aplicacao.register(user_login, { prefix: '/api' });

    aplicacao.listen({ port: 3220, host: '0.0.0.0' }, () => {
        console.log("Fastify rodando na porta 3220 com Zod ativado!");
    });

} catch (erro) {
    aplicacao.log.error(erro);
    process.exit(1);
}