import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PublicRoute = ({ component: Component, ...rest }) => {
	const { currentUser } = useAuth();

	// Redirects to home page if user is already logged in
	return (
		<Route
			{...rest}
			render={props => (
				currentUser
					? <Redirect to="/" />
					: <Component {...props} />)}
		/>
	)
}

export default PublicRoute;