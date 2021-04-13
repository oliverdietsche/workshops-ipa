import firebase from 'firebase/app';
import 'firebase/functions';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface IFirebaseContext {
	functions: firebase.functions.Functions | undefined;
}

const FirebaseContext = createContext<IFirebaseContext>({
	functions: undefined,
});

export interface IFirebaseProviderProps {
	children: ReactNode;
	config: Partial<IFirebaseConfig>;
}

export function FirebaseProvider({ children, config }: IFirebaseProviderProps) {
	const [functions, setFunctions] = useState<firebase.functions.Functions>();

	useEffect(() => {
		const workshopsFirebase = firebase.initializeApp(config);
		setFunctions(workshopsFirebase.functions());
		return () => {
			workshopsFirebase.delete();
		};
	}, [config]);

	return (
		<FirebaseContext.Provider
			value={{
				functions,
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
}

export const useFirebase = () => useContext(FirebaseContext);
