import { css } from '@emotion/react';
import { Grid } from '@material-ui/core';
import { useTheme } from '../../../theme';
import { WorkshopPreview } from '../WorkshopPreview/WorkshopPreview';

export interface IWorkshopPreviewListProps {
	workshops: IWorkshop[];
	onClick: (id: string) => void;
	inactive?: boolean;
	item?: boolean;
}

export function WorkshopPreviewList({ workshops, onClick, inactive = false, item = false }: IWorkshopPreviewListProps) {
	const theme = useTheme();
	return (
		<Grid container item={item} direction="row" spacing={3}>
			{workshops.map((workshop, index) => (
				<Grid
					key={`workshop-${workshop.id ?? index}`}
					item
					css={css`
						${theme.breakpoints.down('xs')} {
							width: 100%;
						}
					`}
				>
					<WorkshopPreview inactive={inactive} workshop={workshop} onClick={onClick} />
				</Grid>
			))}
		</Grid>
	);
}
