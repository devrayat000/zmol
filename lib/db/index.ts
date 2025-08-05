import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Disable prefetch as it's not supported by all postgres providers
const client = neon(process.env.DATABASE_URL!, {  });
export const db = drizzle({ client, schema });
 
export * from './schema';
