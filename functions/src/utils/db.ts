import { firestore } from 'firebase-admin';

interface IFirestoreCollections {
	workshops: firestore.CollectionReference<firestore.DocumentData>;
}

let db: IFirestoreCollections | undefined = undefined;

/**
 * Simplifies usage of collections by creating shorthands for them
 * @returns Object with shorthands for collections
 */
export const initDb = (): IFirestoreCollections => {
	db = {
		workshops: firestore().collection('workshops'),
	};
	return db;
};

/**
 * Can be hooked in firestore call chain to type the data stored and fetched
 */
export const converter = <T>() => ({
	toFirestore: (data: T) => data,
	fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T,
});

/**
 * Fetch a specific workshop from the 'workshops' collections
 * @param workshopId Id of the workshop to fetch
 * @returns Workshop
 */
export async function getWorkshopByFirestoreId(workshopId: string): Promise<IWorkshop | undefined> {
	if (!db) throw new Error('db not initialized');
	const workshopEntry = await db.workshops.withConverter(converter<IWorkshop>()).doc(workshopId).get();
	return workshopEntry.data();
}

/**
 * Deletes a workshop in the database by its id
 * @param workshopId Id of the workshop to fetch
 */
export async function deleteWorkshopByFirestoreId(workshopId: string) {
	if (!db) throw new Error('db not initialized');
	await db.workshops.doc(workshopId).delete();
}

/**
 * Fetches all workshops and returns them typed and with the id assigned
 * @returns List of Workshops
 */
export async function getWorkshops(): Promise<IWorkshop[]> {
	if (!db) throw new Error('db not initialized');
	const workshopEntries = await db.workshops.withConverter(converter<IWorkshop>()).get();
	return workshopEntries.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}
