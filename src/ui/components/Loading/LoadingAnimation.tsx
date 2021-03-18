import { CircularProgress, Grid } from '@material-ui/core';

export function LoadingAnimation() {
	return (
		<Grid container justify="center">
			<CircularProgress />
		</Grid>
	);
}
