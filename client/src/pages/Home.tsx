import { FormEventHandler, FC } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useHistory } from 'react-router-dom';

const Home: FC = () => {
	const { currentUser, logout } = useAuth();
	const history = useHistory();

	const handleLogout: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		await logout();
		history.push('/login');
	}

	return (
		<div>
			{currentUser ? (
				<>
					<p><strong>Name:</strong> {currentUser.name}</p>
					<p><strong>Email address:</strong> {currentUser.email}</p>
					<p><strong>Username:</strong> {currentUser.username}</p>
					<form method="POST" onSubmit={handleLogout}>
						<input className="primary" type="submit" value="Log out" />
					</form>
				</>
			) : (
				<>
					<p>No current user</p>
					<Link to="/signup">Sign Up</Link>
					<br />
					<Link to="/login">Login</Link>
				</>
			)}
		</div>
	)
}

export default Home;