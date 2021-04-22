import { css } from '@emotion/react';
import { Fab, PropTypes } from '@material-ui/core';
import { Fragment, ReactFragment } from 'react';
import { useTheme } from '../../../theme';

export interface IFloatingActionsButtonsProps {
	items: {
		color: PropTypes.Color;
		icon: ReactFragment;
		onClick: () => void;
	}[];
}

/**
 * This component displays a button, which's going to execute the provided function property.
 * It's intended to redirect the user to the workshop planning page.
 */
export function FloatingActionButtons({ items }: IFloatingActionsButtonsProps) {
	const theme = useTheme();
	// caution: the hight depends on the implementation of MUI and on the size of fab (56 is default)
	const FAB_HEIGHT = 56;
	return (
		<Fragment>
			{items.map(({ color, icon, onClick }, index) => (
				<Fab
					key={`fab-${index}`}
					css={css`
						position: absolute;
						bottom: ${(index + 1) * theme.spacing(2) + index * FAB_HEIGHT}px;
						right: ${theme.spacing(2)}px;
						position: fixed;
					`}
					color={color}
					onClick={onClick}
				>
					{icon}
				</Fab>
			))}
		</Fragment>
	);
}
