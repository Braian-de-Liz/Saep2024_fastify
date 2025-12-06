import { FastifyPluginAsync, RouteShorthandOptions } from 'fastify';

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


    aplicacao.post<{ Body: ITaskBody }>("/criar_tarefa", postTaskSchema, async (request, reply) => {

        const { id_usuario, data, setor, status } = request.body;

    })

}

export default insertTask;