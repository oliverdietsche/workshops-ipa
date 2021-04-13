module.exports = {
	reactStrictMode: true,
	env: {
		googleClientId: process.env.GOOGLE_CLIENT_ID,
		googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
		firebaseApiKey: process.env.FIREBASE_API_KEY,
		firebaseAauthDomain: process.env.FIREBASE_AUTH_DOMAIN,
		firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
		firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
		firebaseAppId: process.env.FIREBASE_APP_ID,
	},
};
