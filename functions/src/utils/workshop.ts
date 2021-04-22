/**
 * The Refresh-Token is sensitive data and should be removed before passing a workshop to the client
 * @param workshop Workshop with Refresh-Token
 * @returns Workshop without Refresh-Token
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

/**
 * @param workshop Base workshop
 * @param eventId EventId to add to the base workshop
 * @returns Base workshop with new eventId
 */
export function addEventIdToWorkshop(workshop: IWorkshop, eventId: string | null | undefined) {
	return {
		...workshop,
		...(workshop.speaker && eventId
			? {
					speaker: {
						...workshop.speaker,
						eventId,
					},
			  }
			: {}),
	};
}
