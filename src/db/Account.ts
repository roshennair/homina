import db from './';

interface Account {
	id: string;
	name: string;
	email: string;
	username: string;
	password: string;
}

const getAccount = async (username: string, email?: string) => {
	if (!email) email = username;
	const queryText = `
		SELECT * FROM account
		WHERE username=$1 OR email=$2;
	`;

	try {
		const res = await db.query(queryText, [username, email]);
		if (res.rowCount > 0) return res.rows[0] as Account;

		return null;
	} catch (e) {
		console.error(e);
	}
}

const createAccount = async (username: string, email: string, name: string, password: string) => {
	const queryText = `
		INSERT INTO account (username, email, name, password)
		VALUES ($1, $2, $3, $4)
		RETURNING *;
	`;

	try {
		const res = await db.query(queryText, [username, email, name, password]);
		return res.rows[0] as Account;
	} catch (e) {
		console.error(e);
	}
}

const resetPassword = async (accountId: string, newPassword: string) => {
	const queryText = `
		UPDATE account
		SET password=$1
		WHERE id=$2;
	`

	try {
		await db.query(queryText, [newPassword, accountId]);
	} catch (e) {
		console.error(e);
	}
}

export default { getAccount, createAccount, resetPassword };