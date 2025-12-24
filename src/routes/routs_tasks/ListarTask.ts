import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { autenticarJWT } from '../../hooks/autenticar_jwt.js';
import { z, ZodObject } from 'zod';


const schemaListagemZod: ZodObject = z.object({
    id_usuario: z.number().int().min(1)
});

const ListagemTasks: FastifyPluginAsyncZod = async (app, options) => {

    app.get("/tarefas/:id_usuario", { preHandler: autenticarJWT, schema: { params: schemaListagemZod } }, async (request, reply) => {
        const { id_usuario } = request.params;

        try {
            const procurarUser = await app.pg.query("SELECT id FROM usuarios WHERE id = $1", [id_usuario]);

            if (procurarUser.rowCount === 0) {
                app.log.warn("usuário não encontrado");

                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'usuário não encontrado'
                });
            }

            const querySql: string = `SELECT * FROM tarefas WHERE id_usuario = $1`;
            const listagemTarefas = await app.pg.query(querySql, [id_usuario]);


            if (listagemTarefas.rowCount === 0) {
                app.log.warn("tarefas do usuário não encontrado");

                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'tarefas do usuário não encontrado'
                });
            }

            return reply.status(200).send({
                status: 'sucesso',
                menssagem: 'tarefas encontradas',
                tarfeas: listagemTarefas.rows
            })
        }
        catch (erro) {
            app.log.error(erro);

            return reply.status(500).send({
                status: 'erro',
                message: 'Erro interno ao listar tarefas.'
            });
        }
    });
}


export default ListagemTasks;