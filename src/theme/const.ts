import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core/styles';

export const THEME: Theme = responsiveFontSizes(
	createMuiTheme({
		palette: {
			type: 'light',
			primary: {
				light: '#4B5C87',
				main: '#253661',
				dark: '#0C1D48',
				contrastText: '#fff',
			},
			secondary: {
				light: '#FFC41A',
				main: '#FFAA00',
				dark: '#D98400',
				contrastText: '#000',
			},
		},
	})
);
