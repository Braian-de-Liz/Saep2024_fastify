// imports básicos
import 'dotenv/config';

import fastify, { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { validatorCompiler, serializerCompiler, } from "fastify-type-provider-zod";
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';

// consfigurações
import prisma_plugin from "./lib/prisma.js";

// Imports de rotas
import { cadastarr_user } from "./routes/user/cadastro.js";
import { Login_user } from "./routes/user/login_user.js";
import { cadastrar_task } from "./routes/tarefas/registras_task.js";



const PORT: number = Number(process.env.PORT);

if (!process.env.JWT_PASSOWORD) {
    console.error("ERRO FATAL: A variável de ambiente JWT_PASSOWORD não foi definida.");
    process.exit(1);
}

const JWT_PASSOWORD: string = process.env.JWT_PASSOWORD


const Fastify: FastifyInstance = fastify().withTypeProvider<ZodTypeProvider>();

Fastify.setValidatorCompiler(validatorCompiler);
Fastify.setSerializerCompiler(serializerCompiler);

await Fastify.register(prisma_plugin);
Fastify.register(cors, { origin: true });
Fastify.register(fastifyJwt, { secret: JWT_PASSOWORD });


Fastify.register(cadastarr_user, { prefix: "/api" });
Fastify.register(Login_user, { prefix: "/api" });
Fastify.register(cadastrar_task, { prefix: "/api" });

const start = async () => {

    try {
        await Fastify.listen({ port: PORT, host: '0.0.0.0' });
    }
    catch (erro) {
        console.warn("Erro ao inicializar servidor");
        process.exit(1);
    }
}

start();