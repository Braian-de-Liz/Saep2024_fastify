import { FastifyPluginAsync, RouteShorthandOptions } from 'fastify';
import bcrypt from 'bcryptjs';

interface user_login {
    email: string;
    senha: string
}   

const login: FastifyPluginAsync = async (aplicacao, options) => {

    const schema_login: RouteShorthandOptions = {
        schema: {
            body: {
                type: 'object',
                required: ['email', 'senha'],
                properties: {
                    email: { type: 'string', minLength: 10 },
                    senha: { type: 'string', minLength: 8 }
                }
            }
        }
    }

    aplicacao.post<{ Body: user_login }>("/login", schema_login, async (request, reply) => {

        const { email, senha } = request.body;


        let db;
        try{

        }
        catch(erro){

        }


    });

}

export default login;