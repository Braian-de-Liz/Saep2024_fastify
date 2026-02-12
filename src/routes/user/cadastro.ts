import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import bcrypt from "bcrypt";

const cadastarr_user: FastifyPluginAsyncZod = async (Fastify, options) => {

    const schema = {
        schema: {
            body: z.object({
                nome: z.string().min(2).max(87),
                email: z.string().min(6).email(),
                senha: z.string().min(6)
            })
        },
        Response: {

            200: z.object({
                status: z.string(),
                menssagem: z.string()
            }),
            409: z.object({
                status: z.string(),
                message: z.string()
            }),
            500: z.object({
                status: z.string(),
                menssagem: z.string()
            })

        }
    }

    Fastify.post("/usuario", schema, async (request, reply) => {
        const { nome, email, senha } = request.body;

        try {
            const verificar_user = await Fastify.prisma.usuario.findUnique({ where: { email } });


            if (verificar_user) {
                return reply.send({
                    status: 'erro',
                    message: "Email já cadastrado."
                });
            }

            const senha_segura = await bcrypt.hash(senha, 10);

            await Fastify.prisma.usuario.create({
                data: {
                    nome, email, senha: senha_segura
                }
            });


            return reply.send({
                status: 'Sucesso',
                menssagem: "usuário cadastrado com sucesso"
            });


        }
        catch (erro) {
            Fastify.log.error(erro);

            return reply.status(500).send({
                status: 'erro',
                menssagem: "erro interno do servidor"
            });
        }
    });
}

export { cadastarr_user };