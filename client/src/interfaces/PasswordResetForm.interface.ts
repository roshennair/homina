export default interface PasswordResetForm {
	accountId: string | null;
	resetToken: string | null;
	newPassword: string;
}