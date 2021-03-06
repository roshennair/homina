import { FC } from 'react';
import { Link } from 'react-router-dom';

interface Props {
	height?: number;
	fillColor?: string;
}

const Logo: FC<Props> = ({ height, fillColor }) => {
	return (
		<Link to="/">
			<svg
				viewBox="0 0 630 630"
				height={height}>
				<path
					d="M104.89,0h-.74A105,105,0,1,0,210,105v-1.14A105,105,0,0,0,104.89,0ZM210,105v.57A105,105,0,0,0,420,105v-1.14A105,105,0,0,0,210,105Zm210,0v.57A105,105,0,0,0,630,105v-1.14A105,105,0,0,0,420,105ZM104.89,210h-.74A105,105,0,1,0,210,315v-1.14A105,105,0,0,0,104.89,210ZM210,315v.57A105,105,0,0,0,420,315v-1.14A105,105,0,0,0,210,315Zm210,0v.57A105,105,0,0,0,630,315v-1.14A105,105,0,0,0,420,315ZM104.89,420h-.74A105,105,0,1,0,210,525v-1.14A105,105,0,0,0,104.89,420ZM210,525v.57A105,105,0,0,0,420,525v-1.14A105,105,0,0,0,210,525Zm210,0v.57A105,105,0,0,0,630,525v-1.14A105,105,0,0,0,420,525Z"
					transform="translate(0 0)"
					fill={fillColor}
				/>
			</svg>
		</Link>
	)
}

Logo.defaultProps = {
	height: 60,
	fillColor: '#ffce1f'
}

export default Logo;