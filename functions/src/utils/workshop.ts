/**
 * Takes a workshop and overwrites the refreshToken with an empty string.
 */
export function removeRefreshTokenFromWorkshop(workshop: IWorkshop): IWorkshop {
	return Object.assign(workshop, { speaker: { refreshToken: '' } });
}
