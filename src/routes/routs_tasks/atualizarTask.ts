import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { autenticarJWT } from '../../hooks/autenticar_jwt.js';
import { z, ZodObject } from 'zod';


const schemaPatchZod: ZodObject = z.object({
    id_tarefa: z.number().int().min(1),
    status_tarefa: z.enum(['a fazer', 'fazendo', 'pronto']),
    id_usuario: z.number().int().min(1)
});


const AtualizarTask: FastifyPluginAsyncZod = async (aplicacao, options) => {

    aplicacao.patch("/tarefas", { preHandler: autenticarJWT, schema: { body: schemaPatchZod } }, async (request, reply) => {
        const { id_tarefa, status_tarefa, id_usuario } = request.body;

        try {
            const procurarTask = await aplicacao.pg.query("SELECT FROM tarefas WHERE id = $1 AND id_usuario = $2", [id_tarefa, id_usuario]);

            if (procurarTask.rowCount === 0) {
                aplicacao.log.warn("tarefa não encontrada");

                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'tarefa não encontrada'
                });
            }
            const querySql: string = `UPDATE tarefas SET status = $1 WHERE id = $2 AND id_usuario = $3`;

            const Atualizar = await aplicacao.pg.query(querySql, [status_tarefa, id_tarefa, id_usuario]);


            if (Atualizar.rowCount === 0) {
                console.error("não foi possível atualizar tarefa");

                return reply.status(401).send({
                    status: 'erro',
                    menssagem: 'erro ao atualizar tarefa'
                });
            }

            return reply.status(200).send({
                status: 'tudo certo',
                menssagem: 'atualizada com sucesso'
            });
        }
        catch (erro) {
            aplicacao.log.error(erro);

            return reply.status(500).send({
                status: 'erro',
                message: 'Erro interno ao atualizar tarefa.'
            });
        }
    });
}

export default AtualizarTask;