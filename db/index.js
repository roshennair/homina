const { Pool } = require('pg');

const {
	DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/homina'
} = process.env;

const pool = new Pool({
	connectionString: DATABASE_URL,
	ssl: { rejectUnauthorized: false }
});

// Execute query on any available client
const query = async (text, params = []) => {
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

	const timeout = setTimeout(() => {
		console.error('A client has been checked out for more than 5 seconds!');
		console.error(`The last executed query on this client was: ${client.lastQuery}`);
	}, 5000);

	client.query = (...args) => {
		client.lastQuery = args;
		const start = Date.now();
		const res = query.apply(client, args);
		const duration = Date.now() - start;
		console.log('Executed SQL query', { args, queryDuration: duration, rowCount: res.rowCount });
		return res;
	}

	client.release = () => {
		clearTimeout(timeout);
		client.query = query;
		client.release = release;
		return release.apply(client);
	}

	return client;
}

const getUser = async (username, email) => {
	if (!email) email = username;
	const queryText = `
		SELECT * FROM account
		WHERE username=$1 OR email=$2`;

	try {
		const res = await query(queryText, [username, email]);
		if (res.rowCount > 0) {
			return res.rows[0];
		} else {
			return null;
		}
	} catch (e) {
		console.error(e);
	}
}

const addUser = async (username, email, name, password) => {
	const queryText = `
		INSERT INTO account (username, email, name, password)
		VALUES ($1, $2, $3, $4);
	`;

	try {
		await query(queryText, [username, email, name, password]);
		return await getUser(username);
	} catch (e) {
		console.error(e);
	}
}

module.exports = {
	getUser,
	addUser
}