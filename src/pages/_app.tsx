import { Provider } from 'next-auth/client';
import type { AppProps } from 'next/app';
import { FirebaseConfig } from '../config';
import { FirebaseProvider, StatusPresentationProvider } from '../providers';
import { ThemeProvider } from '../theme';
import { Layout } from '../ui';

/**
 * Overwrites default App and allows to add page-wide shared code
 * @param Component - The page component that gets rendered
 * @param pageProps - The props that belong to the page component
 */
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<FirebaseProvider config={FirebaseConfig}>
			<Provider session={pageProps.session}>
				<ThemeProvider>
					<StatusPresentationProvider>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</StatusPresentationProvider>
				</ThemeProvider>
			</Provider>
		</FirebaseProvider>
	);
}

export default MyApp;
