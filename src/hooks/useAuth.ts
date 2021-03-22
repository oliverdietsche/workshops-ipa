import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

export const useAuth = (logInRequired: boolean) => {
	const router = useRouter();
	const [session, loading] = useSession();

	if (!logInRequired) return { approved: true, session };
	if (loading) return { approved: false, session };
	if (session) return { approved: true, session };
	router.push(`/login?redirect=${router.pathname}${router.query.id ? `?id=${router.query.id}` : ''}`);
	return { approved: false, session };
};
