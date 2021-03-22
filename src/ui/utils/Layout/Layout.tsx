import { css } from '@emotion/react';
import { Container, useTheme } from '@material-ui/core';
import { Fragment } from 'react';
import { LayoutConfig } from '../../../config';

export interface ILayoutProps {
	children: JSX.Element;
	headerComponent?: JSX.Element;
}

/**
 * This component provides a layout for every pages content.
 */
export function Layout({ children, headerComponent }: ILayoutProps) {
	// Using useTheme hook of material-ui on purpose in order to use this component as a decorator in storybook.
	const theme = useTheme();
	return (
		<Fragment>
			{headerComponent && <header>{headerComponent}</header>}
			<Container
				component="main"
				maxWidth={LayoutConfig.maxWidth}
				css={css`
					margin-top: ${theme.spacing(3)}px;
				`}
			>
				{children}
			</Container>
		</Fragment>
	);
}
