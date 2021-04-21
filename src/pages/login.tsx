import { Button, Grid, Typography } from '@material-ui/core';
import { signIn, useSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

export default function LoginPage() {
	const { t } = useTranslation('pLogin');
	const router = useRouter();
	const [session, loading] = useSession();

	if (loading) return null;
	if (session) {
		// Check for redirect property in url and if it doesn't exist go to the homepage
		router.push(typeof router.query.redirect === 'string' ? router.query.redirect : '/');
		return null;
	}
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant="h3" component="h1">
					{t('title')}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>{t('hint')}</Typography>
			</Grid>
			<Grid item xs={12}>
				<Button variant="contained" color="primary" onClick={async () => signIn('google')}>
					{t('loginButton')}
				</Button>
			</Grid>
		</Grid>
	);
}
