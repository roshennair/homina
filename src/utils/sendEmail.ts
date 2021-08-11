import { createTransport } from 'nodemailer';
import { google } from 'googleapis';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const {
	CLIENT_EMAIL = '',
	CLIENT_ID = '',
	CLIENT_SECRET = '',
	REDIRECT_URI = '',
	REFRESH_TOKEN = ''
} = process.env;

const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export default async (email: string, subject: string, html: string) => {
	try {
		// Generate the accessToken on the fly
		const accessToken = await OAuth2Client.getAccessToken();

		// Create the email transport
		const transport = createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: CLIENT_EMAIL,
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken,
			},
		} as SMTPTransport.Options);

		// Deliver email
		await transport.sendMail({ from: CLIENT_EMAIL, to: email, subject, html });
	} catch (error) {
		return error;
	}
}