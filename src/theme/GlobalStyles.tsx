import { css, Global } from '@emotion/core';
import { useTheme } from './ThemeProvider';

/**
 * This component is used to inject on every page and provide global styles.
 */
export function GlobalStyles() {
	const theme = useTheme();

	return (
		<Global
			styles={css`
				body {
					background: ${theme.palette.background.default};
				}
			`}
		/>
	);
}
