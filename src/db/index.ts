import { Pool } from 'pg';

const {
	DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/homina'
} = process.env;

const pool = new Pool({
	connectionString: DATABASE_URL,
	ssl: { rejectUnauthorized: false }
});

// Execute query on any available client
const query = async (text: string, params: string[]) => {
	// Execute a single query
	const start = Date.now();
	const res = await pool.query(text, params);
	const duration = Date.now() - start;
	console.log('Executed SQL query', { text, queryDuration: duration, rowCount: res.rowCount });
	return res;
}

// Checkout single client for transaction
const getClient = async () => {
	const client = await pool.connect();
	const query = client.query;
	const release = client.release;
	// set a timeout of 5 seconds, after which we will log this client's last query
	const timeout = setTimeout(() => {
		console.error('A client has been checked out for more than 5 seconds!');
		console.error(`The last executed query on this client was: ${(client as any).lastQuery}`);
	}, 5000);
	// monkey patch the query method to keep track of the last query executed
	(client as any).query = (...args: any) => {
		(client as any).lastQuery = args;
		return query.apply(client, args);
	}
	client.release = () => {
		// clear our timeout
		clearTimeout(timeout);
		// set the methods back to their old un-monkey-patched version
		client.query = query;
		client.release = release;
		return release.apply(client);
	}
	return client;
}

export default { query, getClient }