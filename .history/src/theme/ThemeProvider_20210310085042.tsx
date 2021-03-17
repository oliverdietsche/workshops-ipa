import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { ReactNode } from 'react';
import { THEME } from './const';
import { GlobalStyles } from './GlobalStyles';

export interface IThemeProviderProps {
	children: ReactNode;
}

export function ThemeProvider({ children }: IThemeProviderProps) {
	return (
		<MuiThemeProvider theme={THEME}>
			<EmotionThemeProvider theme={THEME}>
					<StylesProvider injectFirst>
				<GlobalStyles />
				{children}
			</EmotionThemeProvider>
		</MuiThemeProvider>
	);
}

export const useTheme = (): Theme => useEmotionTheme();
