import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let db:
	| ReturnType<typeof drizzlePg<typeof schema>>
	| ReturnType<typeof drizzleNeon<typeof schema>>;

declare global {
	var drizzle: typeof db;
	var client: ReturnType<typeof postgres>;
}

// Disable prefetch as it's not supported by all postgres providers
if (process.env.NODE_ENV === "production") {
	const client = neon(process.env.DATABASE_URL!, {});
	db = drizzleNeon({ client, schema });
} else {
	const client =
		globalThis.client ||
		postgres(process.env.DATABASE_URL!, {
			max: 1,
			idle_timeout: 30,
		});
	globalThis.client = client;
	db = globalThis.drizzle || drizzlePg({ client, schema });
	globalThis.drizzle = db;
}

export { db };

export * from "./schema";
