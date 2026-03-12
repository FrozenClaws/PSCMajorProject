"use client";

import { useRouter } from "next/navigation";
import { useDisconnect, useActiveWallet } from "thirdweb/react";

export default function LogoutButton() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  const handleLogout = async () => {
    try {
      if (wallet) {
        await disconnect(wallet);
      }
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    } finally {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition hover:border-red-400 hover:text-red-200 hover:bg-slate-900"
    >
      Log out
    </button>
  );
}

