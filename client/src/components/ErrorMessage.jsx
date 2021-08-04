import React from 'react';

const ErrorMessage = ({ error, hideError }) => {
	return (
		<div className="error">
			<span>{error}</span>
			<a href="#" onClick={hideError}>x</a>
		</div>
	)
}

export default ErrorMessage;
