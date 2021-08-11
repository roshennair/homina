import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import Account from '../db/Account';
import ResetToken from '../db/ResetToken';
import sendEmail from '../utils/sendEmail';

const {
	SESSION_NAME = 'sid',
	SALT_ROUNDS = 10,
	HOMINA_DOMAIN = 'https://homina.herokuapp.com',
	TOKEN_SIZE = 32
} = process.env;

declare module 'express-session' {
	export interface SessionData {
		accountId: string | null;
	}
}

const signup = async (req: Request, res: Response) => {
	const { name, email, username, password } = req.body;

	if (name && email && username && password) {
		// Ensure account doesn't already exist
		const existingAccount = await Account.getAccount(username, email);
		if (existingAccount) {
			return res.status(409).json({ message: 'Account already exists' });
		}

		// Hash password and add new account
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const newAccount = (await Account.createAccount(username, email, name, hashedPassword))!;

		// Set session cookie and return new account details 
		req.session.accountId = newAccount.id;
		res.status(200).json({
			name: newAccount.name,
			username: newAccount.username,
			email: newAccount.email
		});
	} else {
		res.status(400).json({ message: 'Missing sign up fields' });
	}
}

const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	if (username && password) {
		const matchingAccount = await Account.getAccount(username);
		if (!matchingAccount) return res.status(404).json({ message: 'Account not found.' });

		const passwordsMatch = await bcrypt.compare(password, matchingAccount.password);
		if (!passwordsMatch) return res.status(401).json({ message: 'Incorrect password.' });

		req.session.accountId = matchingAccount.id;
		res.status(200).json({
			name: matchingAccount.name,
			username: matchingAccount.username,
			email: matchingAccount.email
		});
	} else {
		res.status(400).json({ message: 'Missing login fields.' });
	}
}

const logout = async (req: Request, res: Response) => {
	req.session.destroy(err => {
		if (err) return res.status(500).json({ message: 'Error logging out.' });
		res.clearCookie(SESSION_NAME);
		res.sendStatus(200);
	});
}

const sendPasswordResetEmail = async (req: Request, res: Response) => {
	const { email } = req.body;

	if (email) {
		const matchingAccount = await Account.getAccount(email);
		if (!matchingAccount) return res.status(404).json({ message: 'Account not found.' });

		// Generate random reset token and store hashed version in DB
		const resetToken = randomBytes(+TOKEN_SIZE).toString('hex');
		const hashedResetToken = await bcrypt.hash(resetToken, SALT_ROUNDS);
		await ResetToken.createToken(hashedResetToken, matchingAccount.id);

		// Generate new reset link
		const resetLink = `${HOMINA_DOMAIN}/reset-password?account_id=${matchingAccount.id}&reset_token=${resetToken}`;

		await sendEmail(email, 'Homina Password Reset', `
			<p>Dear ${matchingAccount.name},</p>
			<p>We recently received a request to reset your account password. If this was you, please click the link below to reset your Homina account password. If the link below does not work, please <a href="${HOMINA_DOMAIN}/forgot-password" target="_blank">try again</a>. If you did not request a password reset, please ignore this email. Thank you.<p>
			<p>Homina password reset link: <a href="${resetLink}" target="_blank">${resetLink}</a></p>
			<p>Yours truly,</p>
			<p>The Homina team</p>
		`);
		res.sendStatus(200);
	} else {
		res.status(400).json({ message: 'Missing name or email field' });
	}
}

const resetPassword = async (req: Request, res: Response) => {
	const { accountId, resetToken, newPassword } = req.body;

	if (accountId && resetToken && newPassword) {
		const storedToken = await ResetToken.getToken(accountId);
		if (!storedToken) return res.status(404).json({ message: 'Reset token expired or not found.' });

		const tokensMatch = await bcrypt.compare(resetToken, storedToken.token);
		if (!tokensMatch) return res.status(401).json({ message: 'Incorrect reset token.' });

		// Hash new password and update account details
		const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
		await Account.resetPassword(accountId, hashedPassword);

		// Delete reset token from DB
		await ResetToken.deleteToken(storedToken.id);

		res.sendStatus(200);
	} else {
		res.status(400).json({ message: 'Missing password reset parameters' });
	}
};

export default {
	signup,
	login,
	logout,
	sendPasswordResetEmail,
	resetPassword
};