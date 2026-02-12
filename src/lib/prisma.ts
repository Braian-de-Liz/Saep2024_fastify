import fp from "fastify-plugin";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prisma_plugin: FastifyPluginAsyncZod = fp(async (Fastify) => {
  const prisma = new PrismaClient({
    datasource: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['query', 'warn', 'error'],
  });

  try {
    await prisma.$connect();
    Fastify.decorate('prisma', prisma);

    Fastify.addHook('onClose', async (server) => {
      await server.prisma.$disconnect();
    });

    console.log("Prisma conectado com sucesso!");
  } catch (error) {
    console.error("Falha na conexão do Prisma:", error);
    process.exit(1);
  }
});

export default prisma_plugin;