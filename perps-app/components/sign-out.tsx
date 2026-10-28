import { signOut } from "@/auth";
import SignOutConfirm from "./sign-out-confirm";

export default function SignOut() {
  async function confirmSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return <SignOutConfirm action={confirmSignOut} />;
}
