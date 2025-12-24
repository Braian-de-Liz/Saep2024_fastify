// src\routes\routs_tasks\deletarTask.ts
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { autenticarJWT } from '../../hooks/autenticar_jwt.js';
import { z, ZodObject } from 'zod';


const schemaDeleteZOD: ZodObject = z.object({
    id: z.number().int().min(1),
    id_tarefa: z.number().int().min(1)
});


const DeletarTask: FastifyPluginAsyncZod = async (aplicacao, options) => {

    aplicacao.delete("/tarefas", { preHandler: [autenticarJWT], schema: { body: schemaDeleteZOD } }, async (request, reply) => {
        const { id, id_tarefa } = request.body;

        try {
            const procurar_user = await aplicacao.pg.query("SELECT id FROM usuarios WHERE id = $1", [id]);

            if (procurar_user.rowCount === 0) {
                aplicacao.log.warn(`Tentativa de delete com usuário inexistente: ${id}`);

                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'usuário não encontrado'
                });
            }

            const resultadoDelete = await aplicacao.pg.query(
                "DELETE FROM tarefas WHERE id = $1 AND id_usuario = $2",
                [id_tarefa, id]
            );

            if (resultadoDelete.rowCount === 0) {
                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Tarefa não encontrada ou não pertence a este usuário.'
                });
            }


            return reply.status(204).send({
                status: 'sucesso',
                menssagem: 'tarefa Deletada com Sucesso'
            });
        }
        catch (erro) {
            aplicacao.log.error(erro);

            return reply.status(500).send({
                status: 'erro',
                message: 'Erro interno ao deletar tarefa.'
            });
        }
    });
}

export default DeletarTask;