import { Button, Grid } from '@material-ui/core';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React from 'react';

export default function LoginPage() {
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
				<Button variant="contained" color="primary" onClick={async () => signIn('google')}>
					Sign in with Google
				</Button>
			</Grid>
		</Grid>
	);
}
