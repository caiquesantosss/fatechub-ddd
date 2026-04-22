import { build } from "./http/server"

async function bootstrap() {
    const app = await build()

    await app.listen({
        port: 3000,
        host: "0.0.0.0"
    })

    console.log("🚀 Server rodando")
}

bootstrap()