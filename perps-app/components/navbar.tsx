import Link from "next/link";
import { auth } from "@/auth";
import SignOut from "./sign-out";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav >
      <Link href="/" aria-label="Preps home">
        Preps
      </Link>
      <div >
        {session?.user ? (
          <>
            <span>{session.user.name?.split(" ")[0] ?? "Member"}</span>
            <SignOut />
          </>
        ) : (
          <Link href="/sign-in">Sign in</Link>
        )}
      </div>
    </nav>
  );
}
