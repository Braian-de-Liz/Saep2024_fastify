import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { autenticarJWT } from '../../hooks/autenticar_jwt.js';
import { z, ZodObject } from 'zod';


const schemaPatchZod: ZodObject = z.object({
    id_tarefa: z.number().int().min(1),
    status: z.enum(['a fazer', 'fazendo', 'pronto'])
});


const AtualizarTask: FastifyPluginAsyncZod = async (aplicacao, options) => {

    aplicacao.patch("/tarefas", { preHandler: autenticarJWT, schema: { body: schemaPatchZod } }, async (request, reply) => {
        const { id_tarefa, status_tarefa, id_usuario } = request.body;

        try {
            const procurarTask = await aplicacao.pg.query("SELECT FROM tarefas WHERE id = $1 AND id_usuario = $2", [id_tarefa, id_usuario]);

            if (!procurarTask) {
                aplicacao.log.warn("tarefa não encontrada");

                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'tarefa não encontrada'
                });
            }


            
        }
        catch (erro) {

        }
    });
}

export default AtualizarTask;