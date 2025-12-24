import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z, ZodObject } from 'zod';
import { autenticarJWT } from '../../hooks/autenticar_jwt.js';


const postTaskSchemaZOD: ZodObject = z.object({
    id_usuario: z.number().int(),
    setor: z.string().min(1),
    prioridade: z.enum(['baixa', 'média', 'alta']),
    descricao: z.string().min(10)
})


const insertTask: FastifyPluginAsyncZod = async (aplicacao, opts) => {


    aplicacao.post("/tarefas", { preHandler: autenticarJWT, schema: { body: postTaskSchemaZOD } }, async (request, reply) => {

        const { id_usuario, setor, prioridade, descricao } = request.body;

        try {
            const procurar_user = await aplicacao.db.query("SELECT id FROM usuarios WHERE id = $1", [id_usuario]);

            if (procurar_user.rowCount === 0) {
                console.error("Usuário não existente");

                reply.status(404).send({
                    status: 'erro',
                    menssagem: 'usário não encontrado, não pode cadastrar tarefa'
                });
            }
            const queryInsert: string = `
                INSERT INTO tarefas (id_usuario, setor, status, prioridade, descricao, criado_em) 
                VALUES ($1, $2, 'a fazer', $3, $4, CURRENT_DATE) 
                RETURNING id
            `;

            const inserir_tarefa = await aplicacao.db.query(queryInsert, [id_usuario, setor, prioridade, descricao]);

            const dadosRow = inserir_tarefa.rows[0];

            return reply.status(201).send({
                status: 'sucesso',
                message: 'Tarefa criada com sucesso!',
                id_tarefa: dadosRow.id
            });
        }
        catch (erro) {
            aplicacao.log.error(erro);
            return reply.status(500).send({
                status: 'erro',
                message: 'Erro interno ao criar tarefa.'
            });
        }

    });

}

export default insertTask;