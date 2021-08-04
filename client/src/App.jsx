import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

const App = () => {
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
