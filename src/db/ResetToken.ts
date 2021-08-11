import db from './';

const {
	TOKEN_TIMEOUT = 15 * 60 * 1000,
} = process.env;

interface ResetToken {
	id: string;
	token: string;
	accountId: string;
}

const deleteToken = async (tokenId: string) => {
	const queryText = `
		DELETE FROM reset_token
		WHERE id=$1;
	`;

	try {
		await db.query(queryText, [tokenId]);
	} catch (e) {
		console.error(e);
	}
}

const getToken = async (accountId: string) => {
	const queryText = `
		SELECT * FROM reset_token
		WHERE account_id=$1;
	`;

	try {
		const res = await db.query(queryText, [accountId]);
		if (res.rowCount > 0) {
			const matchingToken = res.rows[0];
			return {
				id: matchingToken.id,
				token: matchingToken.token,
				accountId: matchingToken.account_id
			} as ResetToken;
		}
		return null;
	} catch (e) {
		console.error(e);
	}
}

const createToken = async (resetToken: string, accountId: string) => {
	// Ensure token doesn't already exist
	const existingToken = await getToken(accountId);
	if (existingToken) {
		await deleteToken(existingToken.id);
	}

	const queryText = `
		INSERT INTO reset_token (token, account_id)
		VALUES ($1, $2);
	`;

	try {
		const res = await db.query(queryText, [resetToken, accountId]);
		// Delete token automatically after 15 minutes
		setTimeout(async () => await deleteToken(res.rows[0].id), +TOKEN_TIMEOUT);
	} catch (e) {
		console.error(e);
	}
}

export default { getToken, createToken, deleteToken }