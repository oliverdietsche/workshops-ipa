import { firestore } from 'firebase-admin';

/**
 * Shorthands for firestore collections.
 */
const initDb = () => ({
	workshops: firestore().collection('workshops'),
});

/**
 * Converter used by .withConverter() of firestore.
 * Doesn't change data but makes sure data returned by the database is typed.
 */
const converter = <T>() => ({
	toFirestore: (data: T) => data,
	fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T,
});

export { initDb, converter };
