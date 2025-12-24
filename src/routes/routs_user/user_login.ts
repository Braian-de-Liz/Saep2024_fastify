// src\routes\routs_user\user_cadastro.ts
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import bcrypt from 'bcryptjs';



const login: FastifyPluginAsyncZod = async (aplicacao, options) => {

    const schema_loginZOD = z.object({
        email: z.string().min(10),
        senha: z.string().min(6)
    });



    aplicacao.post("/login", { schema: { body: schema_loginZOD } }, async (request, reply) => {

        const { email, senha } = request.body;

        try {
            const encontrar_user = await aplicacao.pg.query("SELECT id, nome, senha FROM usuarios WHERE email = $1", [email]);

            if (encontrar_user.rowCount !== 1) {
                console.error("usuário não encontrado");

                return reply.status(404).send({
                    status: 'erro',
                    menssagens: 'usuário não encontrado'
                });
            }

            const usuario = encontrar_user.rows[0];

            const senha_hashComp = await bcrypt.compare(senha, usuario.senha);

            if (!senha_hashComp) {
                console.error("senha incorreta inserida");

                return reply.status(401).send({
                    status: 'erro',
                    menssagem: 'E-mail ou senha inválidos'
                });
            }

            const token = aplicacao.jwt.sign(
                { id: usuario.id, nome: usuario.nome },
                { expiresIn: '8h' }
            );

            return reply.status(201).send({
                status: 'sucesso',
                menssagem: 'Login realizado com sucesso',
                token: token
            });
        }
        catch (erro) {
            aplicacao.log.warn("erro no servidor" + erro);

            return reply.status(500).send({
                status: 'erro',
                menssagem: 'erro interno do servidor'
            });
        }

        
    });

}

export default login;