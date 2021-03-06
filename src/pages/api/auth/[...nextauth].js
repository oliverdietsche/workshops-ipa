/* eslint-disable */
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

/**
 * Takes a token with `refresh_token`, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 * ref: https://github.com/lawrencecchen/next-auth-refresh-tokens/blob/main/pages/api/auth/%5B...nextauth%5D.js
 */
async function refreshAccessToken(token) {
	if (!token.refreshToken)
		return {
			...token,
			error: 'RefreshTokenMissingError',
		};

	const url = `https://oauth2.googleapis.com/token?${new URLSearchParams({
		client_id: process.env.googleClientId,
		client_secret: process.env.googleClientSecret,
		grant_type: 'refresh_token',
		refresh_token: token.refreshToken,
	})}`;

	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
	});

	const refreshedTokens = await response.json();

	if (!response.ok) {
		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}

	return {
		...token,
		accessToken: refreshedTokens.access_token,
		accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
		refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
	};
}

export default NextAuth({
	providers: [
		Providers.Google({
			clientId: process.env.googleClientId,
			clientSecret: process.env.googleClientSecret,
			authorizationUrl:
				'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
			scope:
				'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
		}),
	],
	callbacks: {
		// ref: https://github.com/lawrencecchen/next-auth-refresh-tokens/blob/main/pages/api/auth/%5B...nextauth%5D.js
		async jwt(token, user, account) {
			// Initial sign in
			if (account && user) {
				return {
					accessToken: account.accessToken,
					accessTokenExpires: Date.now() + account.expires_in * 1000,
					refreshToken: account.refresh_token,
					user,
				};
			}

			// Return previous token if the access token has not expired yet
			if (Date.now() < token.accessTokenExpires) {
				return token;
			}

			// Access token has expired, try to update it
			return refreshAccessToken(token);
		},
		async session(session, token) {
			if (token) {
				session.user = token.user;
				session.accessToken = token.accessToken;
				session.error = token.error;
				session.refreshToken = token.refreshToken;
			}

			return session;
		},
	},
});
