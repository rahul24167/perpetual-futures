"use client";

import { useState } from "react";

export default function SignOutConfirm({ action }: { action: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} >
        Sign out
      </button>
    );
  }

  return (
    <form action={action} >
      <p>Sign out?</p>
      <button type="button" onClick={() => setConfirming(false)} >
        Cancel
      </button>
      <button type="submit">Yes, sign out</button>
    </form>
  );
}
