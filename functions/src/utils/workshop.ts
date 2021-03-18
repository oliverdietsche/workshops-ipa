/**
 * Takes a workshop and overwrites the refreshToken with an empty string.
 */
export function removeRefreshTokenFromWorkshop(workshop: IWorkshop): IWorkshop {
	if (!workshop.speaker) return workshop;
	return {
		...workshop,
		speaker: {
			...workshop.speaker,
			refreshToken: '',
		},
	};
}
