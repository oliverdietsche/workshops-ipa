interface IFunctionsApi {
	createWorkshopParams: { workshop: IWorkshop };
	createWorkshopOutput: string;

	updateWorkshopParams: { workshopId: string; workshop: IWorkshop };
	updateWorkshopOutput: string;

	deleteWorkshopParams: { workshopId: string };
	deleteWorkshopOutput: string;

	addWorkshopAttendeeParams: { workshopId: string; attendee: IAttendee };
	addWorkshopAttendeeOutput: { entryUpdated: boolean; eventUpdated: boolean; reason?: string };

	getWorkshopByIdParams: { workshopId: string };
	getWorkshopByIdOutput: IWorkshop | undefined;

	listWorkshopsParams: {
		start?: string; // Date in RFC3339 format
		end?: string; // Date in RFC3339 format
	};
	listWorkshopsOutput: IWorkshop[];
}
