import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

export default function LogoutPage() {
	const router = useRouter();
	const [session, loading] = useSession();

	if (loading) return null;
	if (session) signOut();
	router.push('/');
	return null;
}
