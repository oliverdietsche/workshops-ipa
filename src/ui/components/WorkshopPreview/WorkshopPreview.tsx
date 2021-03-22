import { css } from '@emotion/react';
import { ButtonBase, Card, CardContent, Typography } from '@material-ui/core';
import { useTheme } from '../../../theme';
import { formatDateShort, formatHoursFromTo, getStartAndEndDate } from '../../../utils';

export interface IWorkshopPreviewProps {
	workshop: IWorkshop;
	onClick: (id: string) => void;
	inactive?: boolean;
}

/**
 * This component displays a preview of the workshop provided.
 * The preview contains the title and timeframe of the workshop.
 * If the workshop has an id, the onClick handler property gets called with the id as a parameter.
 * By setting the inactive property to true, this element gets a more grey style.
 */
export function WorkshopPreview({ workshop, onClick, inactive = false }: IWorkshopPreviewProps) {
	const theme = useTheme();
	const { details, id } = workshop;
	const { startDate, endDate } = getStartAndEndDate(details);
	return (
		<Card
			elevation={3}
			css={css`
				width: 288px;

				${theme.breakpoints.down('xs')} {
					width: 100%;
				}
			`}
		>
			<ButtonBase
				css={css`
					width: 100%;
					text-align: left;
					justify-content: flex-start;
					${inactive ? `color: ${theme.palette.text.disabled};` : ''}
				`}
				onClick={() => id && onClick(id)}
			>
				<CardContent
					css={css`
						width: 100%;
						box-sizing: border-box;
					`}
				>
					<Typography
						variant="h6"
						component="h3"
						css={css`
							width: 100%;
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
