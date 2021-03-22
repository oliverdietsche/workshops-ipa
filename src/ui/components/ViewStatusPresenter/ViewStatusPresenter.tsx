import { Dialog, DialogContent, DialogContentText, Snackbar } from '@material-ui/core';
import { Fragment } from 'react';
import { LoadingAnimation } from '../LoadingAnimation';

export interface IViewStatusPresenterProps {
	status: TViewStatus;
	setStatus: (newStatus: TViewStatus) => void;
	messages: {
		waiting: string;
		success: string;
		error: string;
	};
}

/**
 * This component presents the status of a view:
 * ACTION -> nothing
 * WAITING -> opens dialog on top of the ui, which contains the provided message and the loading animation
 * SUCCESS -> displays the provided message at the bottom in a snackbar
 * ERROR -> displays the provided message at the bottom in a snackbar
 */
export function ViewStatusPresenter({ status, setStatus, messages }: IViewStatusPresenterProps) {
	return (
		<Fragment>
			<Dialog open={status === 'WAITING'}>
				<DialogContent>
					<DialogContentText>{messages.waiting}</DialogContentText>
					<LoadingAnimation />
				</DialogContent>
			</Dialog>
			<Snackbar
				open={status === 'SUCCESS'}
				autoHideDuration={5000}
				message={messages.success}
				onClose={() => setStatus('ACTIVE')}
			/>
			<Snackbar
				open={status === 'ERROR'}
				autoHideDuration={5000}
				message={messages.error}
				onClose={() => setStatus('ACTIVE')}
			/>
		</Fragment>
	);
}
