import { firestore } from 'firebase-admin';

interface IFirestoreCollections {
	workshops: firestore.CollectionReference<firestore.DocumentData>;
}

let db: IFirestoreCollections | undefined = undefined;

/**
 * Initialize shorthands for firestore collections.
 * App initialization needs to be executed first.
 */
export const initDb = (): IFirestoreCollections => {
	db = {
		workshops: firestore().collection('workshops'),
	};
	return db;
};

/**
 * Converter used by .withConverter() of firestore.
 * Doesn't change data but makes sure data returned by the database is typed.
 */
export const converter = <T>() => ({
	toFirestore: (data: T) => data,
	fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T,
});

/**
 * Expects the id of a workshop persisted in the database.
 * This method tries to fetch that specific workshop and returns it if successful.
 */
export async function getWorkshopByFirestoreId(workshopId: string): Promise<IWorkshop | undefined> {
	if (!db) throw new Error('db not initialized');
	const workshopEntry = await db.workshops.withConverter(converter<IWorkshop>()).doc(workshopId).get();
	return workshopEntry.data();
}

/**
 * This method fetches all workshops and returns them typed and with the id assigned.
 */
export async function getWorkshops(): Promise<IWorkshop[]> {
	if (!db) throw new Error('db not initialized');
	const workshopEntries = await db.workshops.withConverter(converter<IWorkshop>()).get();
	return workshopEntries.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}
