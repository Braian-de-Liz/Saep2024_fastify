import { FastifyPluginAsync, RouteShorthandOptions } from 'fastify';
import { connectar } from "../../data/conecction.js"; 

interface ITaskBody {
    id_usuario: number;
    data: string;
    setor: string;
    status: string;
}

const postTaskSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['id_usuario', 'data', 'setor', 'status'], 
            properties: {
                id_usuario: { type: 'number' },
                data: { type: 'string', format: 'date' }, 
                setor: { type: 'string' },
                status: { type: 'string' }
            },
        },
        response: {
            201: {
                type: 'object',
                properties: { message: { type: 'string' }, id: { type: 'number' } }
            }
        }
    }
};


const insertTask: FastifyPluginAsync = async (aplicacao, opts) => {
    
    const pool = await connectar(); 

    aplicacao.post<{ Body: ITaskBody }>( 
        "/criar_tarefa", 
        postTaskSchema, 
        async (request, reply) => {
            
            const { id_usuario, data, setor, status } = request.body;
            
            request.log.info(`Recebida nova tarefa para o usuário: ${id_usuario}`);

            try {
                const query = `INSERT INTO tarefas (id_usuario, data, setor, status) 
                               VALUES ($1, $2, $3, $4) RETURNING id`;
                
                const result = await pool.query(query, [String(id_usuario), data, setor, status]);

                reply.code(201).send({ 
                    message: "Tarefa criada com sucesso!", 
                    id: result.rows[0].id
                });
                
            } catch (err) {
                aplicacao.log.error(err, 'Erro ao inserir tarefa no DB');
                
                reply.code(500).send({ message: "Erro interno do servidor ao processar a tarefa." });
            }
        }
    );
};

export default insertTask;