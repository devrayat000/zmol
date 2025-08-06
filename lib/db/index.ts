import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (process.env.NODE_ENV === "development") {
	neonConfig.fetchEndpoint = (host) => {
		const [protocol, port] =
			host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
		return `${protocol}://${host}:${port}/sql`;
	};
}

const client = neon(process.env.DATABASE_URL!, {});
export const db = drizzleNeon({ client, schema });

export * from "./schema";
