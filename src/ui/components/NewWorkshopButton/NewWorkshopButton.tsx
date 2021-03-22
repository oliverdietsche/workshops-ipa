import { css } from '@emotion/react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useTheme } from '../../../theme';

export interface INewWorkshopButtonProps {
	redirectToWorkshopPlanningPage: () => void;
}

/**
 * This component displays a button, which's going to execute the provided function property.
 * It's intended to redirect the user to the workshop planning page.
 */
export function NewWorkshopButton({ redirectToWorkshopPlanningPage }: INewWorkshopButtonProps) {
	const theme = useTheme();
	return (
		<Fab
			css={css`
				position: absolute;
				bottom: ${theme.spacing(2)}px;
				right: ${theme.spacing(2)}px;
				position: fixed;
			`}
			color="primary"
			onClick={redirectToWorkshopPlanningPage}
		>
			<AddIcon />
		</Fab>
	);
}
