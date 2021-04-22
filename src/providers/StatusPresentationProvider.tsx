import { Dialog, DialogContent, DialogContentText, Snackbar } from '@material-ui/core';
import { createContext, ReactNode, useContext, useState } from 'react';
import { LoadingAnimation } from '../ui';

export interface IStatusPresentationContext {
	startLoading: (message: string) => () => void;
	showInfo: (message: string) => void;
}

const StatusPresentationContext = createContext<IStatusPresentationContext>({
	startLoading: () => () => {},
	showInfo: () => {},
});

export interface IStatusPresentationProps {
	children: ReactNode;
}

export function StatusPresentationProvider({ children }: IStatusPresentationProps) {
	const [dialogMessage, setDialogMessage] = useState<string | null>(null);
	const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

	const startLoading: IStatusPresentationContext['startLoading'] = (message) => {
		setDialogMessage(message);
		return () => setDialogMessage(null);
	};
	const showInfo: IStatusPresentationContext['showInfo'] = (message) => setSnackbarMessage(message);

	return (
		<StatusPresentationContext.Provider
			value={{
				startLoading,
				showInfo,
			}}
		>
			{children}
			<Dialog open={dialogMessage !== null}>
				<DialogContent>
					<DialogContentText>{dialogMessage}</DialogContentText>
					<LoadingAnimation />
				</DialogContent>
			</Dialog>
			<Snackbar
				open={snackbarMessage !== null}
				autoHideDuration={5000}
				message={snackbarMessage}
				onClose={() => setSnackbarMessage(null)}
			/>
		</StatusPresentationContext.Provider>
	);
}

export const useStatusPresenter = () => useContext(StatusPresentationContext);
