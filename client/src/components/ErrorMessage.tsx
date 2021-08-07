import { FC, MouseEventHandler } from 'react';

interface Props {
	error: string;
	hideError: MouseEventHandler<HTMLAnchorElement>;
}

const ErrorMessage: FC<Props> = ({ error, hideError }) => {
	return (
		<div className="error">
			<span>{error}</span>
			{/* eslint-disable-next-line */}
			<a href="#" onClick={hideError}>x</a>
		</div>
	)
}

export default ErrorMessage;
