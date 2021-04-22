import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import I18nProvider from 'next-translate/I18nProvider';
import React from 'react';
import { StatusPresentationProvider } from '../src/providers';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { Layout } from '../src/ui/utils';

const withThemeProvider = (Story) => (
	<ThemeProvider>
		<Story />
	</ThemeProvider>
);

const withLayout = (Story) => (
	<Layout>
		<Story />
	</Layout>
);

const withStatusPresentationProvider = (Story) => (
	<StatusPresentationProvider>
		<Story />
	</StatusPresentationProvider>
);

const withI18nProvider = (Story) => (
	<I18nProvider lang="en">
		<Story />
	</I18nProvider>
);

export const decorators = [withThemeProvider, withLayout, withStatusPresentationProvider, withI18nProvider];

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
