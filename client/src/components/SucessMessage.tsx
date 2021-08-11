import { FC, MouseEventHandler } from 'react';

interface Props {
	success: string;
	hideSuccess: MouseEventHandler<HTMLAnchorElement>;
}

const SucessMessage: FC<Props> = ({ success, hideSuccess }) => {
	return (
		<div className="success">
			<span>{success}</span>
			{/* eslint-disable-next-line */}
			<a href="#" onClick={hideSuccess}>x</a>
		</div>
	)
}

export default SucessMessage;
