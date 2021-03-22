import DateFnsUtils from '@date-io/date-fns';
import { Theme, ThemeProvider as EmotionThemeProvider, useTheme as useEmotionTheme } from '@emotion/react';
import { StylesProvider, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ReactNode } from 'react';
import { THEME } from './const';
import { GlobalStyles } from './GlobalStyles';

export interface IThemeProviderProps {
	children: ReactNode;
}

/**
 * This component sums all provider according the theme and styles.
 */
export function ThemeProvider({ children }: IThemeProviderProps) {
	return (
		<MuiThemeProvider theme={THEME}>
			<EmotionThemeProvider theme={THEME}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<StylesProvider injectFirst>
						<GlobalStyles />
						{children}
					</StylesProvider>
				</MuiPickersUtilsProvider>
			</EmotionThemeProvider>
		</MuiThemeProvider>
	);
}

export const useTheme = (): Theme => useEmotionTheme();
