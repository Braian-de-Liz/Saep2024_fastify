import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { autenticarJWT } from "../../hooks/JWT_verific.js";


const cadastrar_task: FastifyPluginAsyncZod = async (Fastify, options) => {

    const schema_postask = {
        preHandler: autenticarJWT,
        schema: {
            body: z.object({
                id_usuario: z.number().int(),
                setor: z.string().min(1),
                prioridade: z.enum(['baixa', 'média', 'alta']),
                descricao: z.string().min(10)
            }),
            response: {
                201: z.object({
                    status: z.string(),
                    message: z.string(),
                    id_tarefa: z.number()
                }),
                404: z.object({
                    status: z.string(),
                    menssagem: z.string()
                }),
                500: z.object({
                    status: z.string(),
                    message: z.string()
                })
            }
        }
    }


    Fastify.post("/tarefas", schema_postask, async (request, reply) => {

        const { id_usuario, setor, prioridade, descricao } = request.body;

        try {
            const select_user = await Fastify.prisma.usuario.findUnique({
                where: { id: id_usuario },
                select: { id: true }
            });

            if (!select_user) {
                Fastify.log.error("usuário não encontrado");

                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'usário não encontrado, não pode cadastrar tarefa'
                });
            }

            const new_task = await Fastify.prisma.tarefa.create({
                data:{
                    id_usuario,
                    setor,
                    prioridade,
                    descricao,
                    status: 'a fazer'
                }
            });

            return reply.status(201).send({
                status: 'sucesso',
                message: 'Tarefa criada com sucesso!',
                id_tarefa: new_task.id
            });
        }

        catch (erro) {
            Fastify.log.error(erro);
            return reply.status(500).send({
                status: 'erro',
                message: 'Erro interno ao criar tarefa.'
            });
        }
    });
}

export { cadastrar_task };