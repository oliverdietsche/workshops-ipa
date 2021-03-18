import { css } from '@emotion/react';
import { ButtonBase, Card, CardContent, Typography } from '@material-ui/core';
import { formatDateShort, formatHoursFromTo, getStartAndEndDate } from '../../../utils';

export interface IWorkshopPreviewProps {
	workshop: IWorkshop;
	onClick: (id: string) => void;
}

export function WorkshopPreview({ workshop, onClick }: IWorkshopPreviewProps) {
	const { details, id } = workshop;
	const { startDate, endDate } = getStartAndEndDate(details);
	return (
		<Card
			elevation={3}
			css={css`
				width: 250px;
				max-width: 250px;
			`}
		>
			<ButtonBase
				css={css`
					width: 100%;
					text-align: left;
					justify-content: flex-start;
				`}
				onClick={() => onClick(id ?? '')}
			>
				<CardContent>
					<Typography
						variant="h6"
						component="h2"
						css={css`
							width: 218px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						`}
					>
						{details.title}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{formatDateShort(startDate)}, {formatHoursFromTo(startDate, endDate)}
					</Typography>
				</CardContent>
			</ButtonBase>
		</Card>
	);
}
