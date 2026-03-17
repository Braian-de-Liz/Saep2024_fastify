import { Hono } from "hono";
import { dbProvider } from "./lib/plugin_db";
import { cadastro_route } from "./routes/user/cadastro";

const Server = new Hono();

Server.use("*", dbProvider);

Server.route("/", cadastro_route);
Server.get("/health", async (c) => {
    return c.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    }, 200);
})


export default {
    fetch: Server,
    port: 3333
}

console.log("rodando com hono");