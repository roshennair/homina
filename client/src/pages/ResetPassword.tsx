import { FC, FormEventHandler, useState } from "react";
import { useAuth } from "src/contexts/authContext";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SucessMessage";
import Logo from "../components/Logo";
import { useHistory, useLocation } from "react-router-dom";

const ResetPassword: FC<{}> = () => {
	const urlSearchParams = new URLSearchParams(useLocation().search);
	const accountId = urlSearchParams.get('account_id');
	const resetToken = urlSearchParams.get('reset_token');
	const [newPassword, setNewPassword] = useState('');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [formSubmitted, setFormSubmitted] = useState(false);
	const { resetPassword } = useAuth();
	const history = useHistory();

	// Request password reset
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		try {
			await resetPassword({ accountId, resetToken, newPassword });
			setFormSubmitted(true);
			setSuccess('Your password was successfully updated!');
		}
		catch (error) {
			setError(error.message);
		}
	}

	return (
		<div className="form-container">
			<div className="form-head">
				<Logo />
				<h1>Reset your Password</h1>
			</div>
			{success && <SuccessMessage success={success} hideSuccess={() => setSuccess('')} />}
			{error && <ErrorMessage error={error} hideError={() => setError('')} />}
			<div className="form-body">
				{!formSubmitted
					? <form method="post" onSubmit={handleSubmit}>
						<label htmlFor="password">New password</label>
						<input type="password" name="password" id="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />

						<input className="primary" type="submit" value="Reset password" />
					</form>
					: <input className="primary" type="submit" value="Back to login page" style={{ marginTop: 0 }} onClick={() => history.push('/login')} />
				}
			</div >
		</div >
	);
}

export default ResetPassword;