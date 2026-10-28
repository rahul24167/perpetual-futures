import Link from "next/link";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react"
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const session = await auth();

  return (
    <main >
      <h1 className="text-xl font-bold">Preps</h1>
      {session?.user &&
        <p >
          Signed in as {session.user.email ?? session.user.name ?? "member"} (role: {session.user.role}).
        </p>
      }
      {!session?.user &&
        <p>
          Not signed in. <Link href="/sign-in">Sign in</Link>
        </p>
      }
      <SessionProvider>
        <Dashboard />
      </SessionProvider>


    </main>
  );
}
