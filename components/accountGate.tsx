"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import ConnectWallet from "@/components/connectWallet";
import "@/app/globals.css";

const INITIALIZING_MS = 800;

export default function AccountGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = useActiveAccount();
  const [allowConnectScreen, setAllowConnectScreen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAllowConnectScreen(true), INITIALIZING_MS);
    return () => clearTimeout(t);
  }, []);

  if (account) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_55%,_#000_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(148,163,184,0.12)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.12)_1px,_transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/40">
          <span className="text-sm font-semibold text-emerald-400">Rx</span>
        </div>

        {!allowConnectScreen ? (
          <>
            <p className="mt-4 text-sm font-medium text-slate-200">
              Connecting...
            </p>
            <div className="mt-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          </>
        ) : (
          <>
            <h1 className="mt-6 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              Connect your wallet
            </h1>
            <p className="mt-2 max-w-sm text-center text-sm text-slate-400">
              Sign in with your wallet to continue to PharmaChain.
            </p>
            <div className="mt-8">
              <ConnectWallet />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
