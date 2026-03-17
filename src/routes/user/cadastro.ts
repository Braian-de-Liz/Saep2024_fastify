import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { users } from '../../lib/schema';
import { eq } from 'drizzle-orm';
import type { Bindings } from '../../lib/plugin_db';

const cadastro_route = new Hono<{ Variables: Bindings }>();

const cadastroSchema = z.object({
    nome: z.string().min(2).max(87),
    email: z.string().min(6).email(),
    senha: z.string().min(6)
});

cadastro_route.post('/usuario', zValidator('json', cadastroSchema), async (c) => {
    const { nome, email, senha } = c.req.valid('json');
    const db = c.get('db');

    try {
        const [verificarUser] = await db.select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (verificarUser) {
            c.status(409);
            return c.json({
                status: 'erro',
                message: 'Email já cadastrado.'
            });
        }

        const senhaSegura = await Bun.password.hash(senha, {
            algorithm: "argon2id",
            memoryCost: 4096, 
            timeCost: 2
        });

        await db.insert(users).values({ nome, email, senha: senhaSegura });

        return c.json({
            status: 'Sucesso',
            message: 'usuário cadastrado com sucesso'
        }, 201);

    }
    catch (erro) {
        console.error(erro);
        c.status(500);
        return c.json({
            status: 'erro',
            message: 'erro interno do servidor'
        });
    }
});

export { cadastro_route };