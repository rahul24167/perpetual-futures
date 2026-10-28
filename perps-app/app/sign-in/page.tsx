import Link from "next/link";
import { auth } from "@/auth";
import SignIn from "@/components/sign-in";

export default async function SignInPage() {
  const session = await auth();

  return (
    <main >
      {session?.user ? (
        <div >
          <h1 >You&apos;re already in.</h1>
          <p>Signed in as {session.user.email ?? session.user.name ?? "Preps member"}.</p>
          <Link href="/">Go home</Link>
        </div>
      ) : (
        <div >
          <h1 >Sign in</h1>
          <p>Use your Google account to sign in or create your Preps account.</p>
          <SignIn />
        </div>
      )}
    </main>
  );
}
