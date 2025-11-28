// src\routes\routs_user\user_cadastro.ts
import { FastifyPluginAsync, RouteShorthandOptions } from 'fastify';
import { connectar } from "../../data/conecction.js";

interface registrar_user {
    nome: string;
    email: string;    
    senha: string;
}

const cadastarr_user: FastifyPluginAsync = async (aplicacao, options) => {

    const schema_json:RouteShorthandOptions = {
        schema: {
            body: {
                type:'object',
                requeired: ['nome', 'email', 'senha'],
                properties:{

                }
            }
        }
    }
    aplicacao.post("/usuario", schema_json, async (request, replay) => {

    });

}

export default cadastarr_user ;
