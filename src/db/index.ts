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

interface User {
	id: string;
	name: string;
	email: string;
	username: string;
	password: string;
}

const getUser = async (username: string, email?: string): Promise<User | null | undefined> => {
	if (!email) email = username;
	const queryText = `
		SELECT * FROM account
		WHERE username=$1 OR email=$2
	`;

	try {
		const res = await query(queryText, [username, email]);
		if (res.rowCount > 0) {
			return (res.rows[0] as User);
		} else {
			return null;
		}
	} catch (e) {
		console.error(e);
	}
}

const addUser = async (username: string, email: string, name: string, password: string) => {
	const queryText = `
		INSERT INTO account (username, email, name, password)
		VALUES ($1, $2, $3, $4)
		RETURNING *;
	`;

	try {
		const res = await query(queryText, [username, email, name, password]);
		if (res.rowCount > 0) {
			return (res.rows[0] as User);
		} else {
			return null;
		}
	} catch (e) {
		console.error(e);
	}
}

export default { getUser, addUser }