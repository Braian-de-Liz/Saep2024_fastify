// src\routes\routs_user\user_cadastro.ts
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const Login_user: FastifyPluginAsyncZod = async (Fastify, options) => {

    const schema_login = {
        schema: {
            body: z.object({
                email: z.string().min(8).email(),
                senha: z.string().min(8)
            }),
            response: {
                201: z.object({
                    status: z.string(),
                    menssagem: z.string(),
                    token: z.string()
                }),
                401: z.object({
                    status: z.string(),
                    menssagem: z.string()
                }),
                404: z.object({
                    status: z.string(),
                    menssagens: z.string()
                }),
                500: z.object({
                    status: z.string(),
                    menssagem: z.string()
                })
            }
        }
    }

    Fastify.post("/usario_login", schema_login, async (request, reply) => {
        const { email, senha } = request.body;

        try {
            const procurar_email = await Fastify.prisma.usuario.findUnique({ where: { email } });

            if (!procurar_email) {
                Fastify.log.error("usuário não encontrado");
                return reply.status(404).send({
                    status: 'erro',
                    menssagens: 'usuário não encontrado'
                });
            }

            const senha_hashComp = await bcrypt.compare(senha, procurar_email.senha);

            if (!senha_hashComp) {
                return reply.status(401).send({
                    status: 'erro',
                    menssagem: 'E-mail ou senha inválidos'
                });
            }

            const token = Fastify.jwt.sign(
                { id: procurar_email.id, nome: procurar_email.nome },
                { expiresIn: '8h' }
            );

            return reply.status(201).send({
                status: 'sucesso',
                menssagem: 'Login realizado com sucesso',
                token: token
            });

        } catch (erro) {
            Fastify.log.warn("erro no servidor: " + erro);
            return reply.status(500).send({
                status: 'erro',
                menssagem: 'erro interno do servidor'
            });
        }
    });
} 

export { Login_user };