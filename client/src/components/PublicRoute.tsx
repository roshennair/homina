import { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

interface Props {
	component: FC;
	[key: string]: any;
}

const PublicRoute: FC<Props> = ({ component: Component, ...rest }) => {
	const { currentUser } = useAuth();

	// Redirects to home page if user is already logged in
	return (
		<Route
			{...rest}
			render={() => currentUser ? <Redirect to="/" /> : <Component />}
		/>
	)
}

export default PublicRoute;