import { CircularProgress, Grid } from '@material-ui/core';

/**
 * This component simply returns a loading animation.
 */
export function LoadingAnimation() {
	return (
		<Grid container justify="center">
			<CircularProgress />
		</Grid>
	);
}
