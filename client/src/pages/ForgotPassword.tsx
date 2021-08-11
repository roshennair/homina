import { FC, FormEventHandler, useState } from "react";
import { useAuth } from "src/contexts/authContext";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SucessMessage";
import Logo from "../components/Logo";
import { useHistory } from "react-router-dom";

const ForgotPassword: FC<{}> = () => {
	const [email, setEmail] = useState('');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [formSubmitted, setFormSubmitted] = useState(false);
	const { sendPasswordResetEmail } = useAuth();
	const history = useHistory();

	// Request password reset
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		try {
			setFormSubmitted(true);
			await sendPasswordResetEmail(email);
			setSuccess('Check your email inbox to reset your password!');
		}
		catch (error) {
			setError(error.message);
		}
	}

	return (
		<div className="form-container">
			<div className="form-head">
				<Logo />
				<h1>Forgot your Password?</h1>
			</div>
			{success && <SuccessMessage success={success} hideSuccess={() => setSuccess('')} />}
			{error && <ErrorMessage error={error} hideError={() => setError('')} />}
			<div className="form-body">
				{!formSubmitted
					? <form method="post" onSubmit={handleSubmit}>
						<label htmlFor="email">Email address</label>
						<input type="email" name="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} />

						<input className="primary" type="submit" value="Send password reset email" />
					</form>
					: <input className="primary" type="submit" value="Back to login page" style={{ marginTop: 0 }} onClick={() => history.push('/login')} />
				}
			</div >
		</div >
	);
}

export default ForgotPassword;