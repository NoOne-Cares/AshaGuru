import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import pg from "pg";
import fs from "fs";
import path from "path";

const { Pool } = pg;

let checkpointer: PostgresSaver | null = null;

export async function getPostgresCheckpointer(): Promise<PostgresSaver> {
    if (checkpointer) return checkpointer;

    // const ca = fs
    //     .readFileSync(path.join(process.cwd(), "certs", "ca.pem"))
    //     .toString();

    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
            // ca,
            // rejectUnauthorized: true,
            ca: process.env.POSTGRES_CA?.replace(/\\n/g, "\n"),
            rejectUnauthorized: true,
        },
        max: 10,
    });

    checkpointer = new PostgresSaver(pool);

    await checkpointer.setup();

    return checkpointer;
}

// export async function getPostgresCheckpointer(): Promise<PostgresSaver> {
//     if (checkpointer) return checkpointer;

//     const pool = new Pool({
//         host: process.env.POSTGRES_HOST || "localhost",
//         port: Number(process.env.POSTGRES_PORT) || 5432,
//         database: process.env.POSTGRES_DB || "asha_guru",
//         user: process.env.POSTGRES_USER || "postgres",
//         password: process.env.POSTGRES_PASSWORD || "postgres",
//         max: 10,
//     });

//     checkpointer = new PostgresSaver(pool);

//     // Create tables on first boot
//     await checkpointer.setup();

//     return checkpointer;
// }
// import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
// import pg from "";

// const { Pool } = pg;

// let checkpointer: PostgresSaver | null = null;

// export async function getPostgresCheckpointer(): Promise<PostgresSaver> {
//     if (checkpointer) return checkpointer;

//     const pool = new Pool({
//         host: process.env.POSTGRES_HOST || "localhost",
//         port: Number(process.env.POSTGRES_PORT) || 5432,
//         database: process.env.POSTGRES_DB || "asha_guru",
//         user: process.env.POSTGRES_USER || "postgres",
//         password: process.env.POSTGRES_PASSWORD || "postgres",
//         max: 10,
//     });

//     checkpointer = PostgresSaver.fromConnString("", { pool });

//     // Create tables on first boot (idempotent)
//     await checkpointer.setup();

//     return checkpointer;
// }
