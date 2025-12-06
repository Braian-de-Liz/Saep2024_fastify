// src\routes\routs_user\user_cadastro.ts
import { FastifyPluginAsync, RouteShorthandOptions } from 'fastify';
import bcrypt from 'bcryptjs';

interface registrar_user {
    nome: string;
    email: string;
    senha: string;
}

const cadastarr_user: FastifyPluginAsync = async (aplicacao, options) => {

    const schema_json: RouteShorthandOptions = {
        schema: {
            body: {
                type: 'object',
                required: ['nome', 'email', 'senha'],
                properties: {
                    nome: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    senha: { type: 'string', minLength: 8 }

                }
            }
        }
    }

    aplicacao.post<{ Body: registrar_user }>("/usuario", schema_json, async (request, reply) => {
        const { nome, email, senha } = request.body;

        try {
            const procurar_user = await aplicacao.db.query("SELECT id FROM usuarios WHERE email = $1", [email]);

            if (procurar_user.rowCount !== 0) {
                console.error("usuário já cadastrado");

                return reply.status(409).send({
                    status: 'erro',
                    message: "Email já cadastrado."
                });
            }

            const senha_segura = await bcrypt.hash(senha, 10);


            await aplicacao.db.query("INSERT INTO usuarios (nome, email, senha) VALUES($1, $2, $3)", [nome, email, senha_segura]);

            reply.status(200).send({
                status: 'erro',
                menssagem: "usuário cadastrado com sucesso"
            }); 

        }
        catch (erro) {
            aplicacao.log.error(erro);

            reply.status(500).send({
                status: 'erro',
                menssagem: `erro interno do servidor`
            })
        }


    });

}

export default cadastarr_user;
