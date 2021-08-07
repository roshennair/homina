import { FC } from 'react';
import { AuthProvider } from './contexts/authContext';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

const App: FC = () => {
	return (
		<AuthProvider>
			<Router>
				<Switch>
					<PrivateRoute exact path='/' component={Home} />
					<PublicRoute path='/signup' component={SignUp} />
					<PublicRoute path='/login' component={Login} />
				</Switch>
			</Router>
		</AuthProvider>
	);
}

export default App;
