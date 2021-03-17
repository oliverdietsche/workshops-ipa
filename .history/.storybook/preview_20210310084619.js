import React from 'react';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const withThemeProvider = (Story) => (
	<ThemeProvider>
		<Story />
	</ThemeProvider>
);

export const decorators = [withThemeProvider];

export const parameters = {
	viewport: {
		viewports: INITIAL_VIEWPORTS,
		defaultViewport: 'iphonex',
	},
	options: {
		storySort: {
			order: ['Pages', 'Components'],
		},
	},
	actions: { argTypesRegex: '^on[A-Z].*' },
};
