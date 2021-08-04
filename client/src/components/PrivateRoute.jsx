import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { currentUser } = useAuth();

	// Redirects to login page unless the user is already logged in
	return (
		<Route
			{...rest}
			render={props => (
				currentUser
					? <Component {...props} />
					: <Redirect to="/login" />)}
		/>
	)
}

export default PrivateRoute;