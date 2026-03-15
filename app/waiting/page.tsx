"use client";

import Link from "next/link";
import "@/app/globals.css";
import LogoutButton from "@/components/logoutButton";
import { useActiveAccount } from "thirdweb/react";

export default function WaitingPage() {
  const account = useActiveAccount();
  console.log(account?.address);
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_55%,_#000_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(148,163,184,0.12)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.12)_1px,_transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10 lg:px-10">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/40">
              <span className="text-sm font-semibold text-emerald-400">Rx</span>
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                PharmaChain
              </p>
              <p className="text-xs text-slate-400">
                Securing the pharmaceutical supply chain
              </p>
            </div>
          </div>

          <LogoutButton />
        </header>

        {/* Content */}
        <section className="flex flex-1 items-center">
          <div className="w-full rounded-3xl border border-slate-800/80 bg-slate-950/70 p-8 shadow-xl shadow-emerald-500/10 backdrop-blur">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Registration Submitted
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              You&apos;re in the verification queue
            </h1>
            <p className="mt-4 text-sm text-slate-300">
              Your stakeholder registration has been received and placed in the
              approval queue. Regulators will review your documents and verify
              your details on-chain. This may take a few minutes depending on
              network conditions and reviewer availability.
            </p>

            <div className="mt-6 grid gap-4 text-xs text-slate-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Status
                </p>
                <p className="mt-1 font-semibold text-emerald-400">
                  Pending Approval
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Notification
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Return here later; once approved you&apos;ll be redirected to
                  your dashboard.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Wallet
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Keep the same wallet connected to access your approved role.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-emerald-300"
              >
                ← Back to home
              </Link>

              {account?.address && (
                <Link
                  href={`/register/update/${account.address}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-100 shadow-sm transition hover:border-emerald-400 hover:bg-slate-900"
                >
                  Update registration details
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

