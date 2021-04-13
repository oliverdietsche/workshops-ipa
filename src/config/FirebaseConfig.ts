export const FirebaseConfig: Partial<IFirebaseConfig> = {
	apiKey: process.env.firebaseApiKey,
	authDomain: process.env.firebaseAuthDomain,
	projectId: process.env.firebaseProjectId,
	storageBucket: process.env.firebaseStorageBucket,
	messagingSenderId: process.env.firebaseMessagingSenderId,
	appId: process.env.firebaseAppId,
};
