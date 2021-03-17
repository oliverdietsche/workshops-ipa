interface IFunctionsApi {
	createWorkshopParams: { details: IWorkshopDetails; speaker?: ISpeaker };
	createWorkshopOutput: string;
	addWorkshopAttendeeParams: { workshopId: string; attendee: IAttendee };
	addWorkshopAttendeeOutput: void;
	getWorkshopByIdParams: { workshopId: string };
	getWorkshopByIdOutput: IWorkshop;
	listWorkshopsParams: {
		start: string; // Date in RFC3339 format
		end: string; // Date in RFC3339 format
	};
	listWorkshopsOutput: IWorkshop[];
}
