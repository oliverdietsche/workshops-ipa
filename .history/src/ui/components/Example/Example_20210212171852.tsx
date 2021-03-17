import { Container, Typography } from '@material-ui/core';

export interface IExampleProps {
	text: string;
}

export function Example({ text }: IExampleProps) {
	return (
		<Container maxWidth="md">
			<Typography>I'm a example component: {text}</Typography>
		</Container>
	);
}
