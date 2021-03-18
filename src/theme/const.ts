import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core/styles';

export const THEME: Theme = responsiveFontSizes(
	createMuiTheme({
		palette: {
			type: 'light',
			primary: {
				light: '#FF336E',
				main: '#FF003B',
				dark: '#CC0008',
				contrastText: '#fff',
			},
			secondary: {
				light: '#33EAC1',
				main: '#00B78E',
				dark: '#00845B',
				contrastText: '#fff',
			},
		},
	})
);
