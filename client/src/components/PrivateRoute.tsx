import { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

interface Props {
	component: FC;
	[key: string]: any;
}

const PrivateRoute: FC<Props> = ({ component: Component, ...rest }) => {
	const { currentUser } = useAuth();

	// Redirects to login page unless the user is already logged in
	return (
		<Route
			{...rest}
			render={() => currentUser ? <Component /> : <Redirect to="/login" />}
		/>
	)
}

export default PrivateRoute;