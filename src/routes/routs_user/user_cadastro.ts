// src\routes\routs_user\user_cadastro.ts
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import bcrypt from 'bcryptjs';



const cadastarr_user: FastifyPluginAsyncZod = async (aplicacao, options) => {

    const schema_zod = z.object({
        nome: z.string().min(2).max(87),
        email: z.string().min(6).email(),
        senha: z.string().min(6)
    });



    aplicacao.post("/usuario", { schema: { body: schema_zod } }, async (request, reply) => {
        const { nome, email, senha } = request.body;

        try {
            const procurar_user = await aplicacao.pg.query("SELECT id FROM usuarios WHERE email = $1", [email]);

            if (procurar_user.rowCount !== 0) {
                console.error("usuário já cadastrado");

                return reply.status(409).send({
                    status: 'erro',
                    message: "Email já cadastrado."
                });
            }

            const senha_segura = await bcrypt.hash(senha, 10);


            await aplicacao.pg.query("INSERT INTO usuarios (nome, email, senha) VALUES($1, $2, $3)", [nome, email, senha_segura]);

            reply.status(200).send({
                status: 'Sucesso',
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
