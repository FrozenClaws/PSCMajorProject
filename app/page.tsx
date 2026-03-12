"use client";

import { useActiveAccount, useReadContract } from "thirdweb/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConnectWallet from "@/components/connectWallet";
import { StakeholderContract as contract} from "@/lib/contracts";
import "@/app/globals.css";
import { ROLE_HASH, ROLE_MAP } from "@/lib/rolemap";

export default function Home() {
  const account = useActiveAccount();
  console.log(account?.address);
  const router = useRouter();
  const [shouldRoute, setShouldRoute] = useState(false);

  const { data, isLoading } = useReadContract({
    contract,
    method: "getStakeholder",
    params: [account?.address as string],
    queryOptions: {
      enabled: !!account,
    },
  });

  const { data: hasRole, isLoading: hasRoleLoading } = useReadContract({
    contract,
    method: "hasRole",
    params: [ROLE_HASH.ADMIN, account?.address as string],
    queryOptions: {
      enabled: !!account,
    },
  });

  useEffect(() => {
    if (hasRole) {
      router.push("/admin");
      return;
    }
    if (!account || isLoading || !shouldRoute) return;

    // thirdweb may return tuples as arrays; normalize to an object
    const stakeholder = Array.isArray(data)
      ? {
          user: data[0] as string,
          name: data[1] as string,
          role: data[2] as string,
          location: data[3] as string,
          detailsIPFSURL: data[4] as string,
          license: data[5] as string,
          approved: data[6] as boolean,
          exists: data[7] as boolean,
        }
      : (data as {
          user: string;
          name: string;
          role: string;
          location: string;
          detailsIPFSURL: string;
          license: string;
          approved: boolean;
          exists: boolean;
        } | null | undefined);

    // Case 1: User exists + approved -> route by role
    if (stakeholder?.exists === true && stakeholder?.approved === true) {
      const roleHash = stakeholder.role as string;
      const role = ROLE_MAP[roleHash];
      if (role) {
        router.push(`/${role}`);
      } else {
        router.push("/dashboard"); // fallback if role not mapped
      }
      return;
    }

    // Case 2: Registered but not approved yet, or explicitly queued -> waiting
    if (
      (stakeholder?.exists === true && stakeholder?.approved === false)) {
      router.push("/waiting");
      return;
    }

    // Case 3: Not registered
    router.push("/register");
  }, [account, data, isLoading, shouldRoute, router]);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_55%,_#000_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(148,163,184,0.12)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.12)_1px,_transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Page content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-6 lg:px-10 lg:pt-10">
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

          {/* Top-right wallet button – triggers routing when user signs in */}
          <div className="hidden sm:block">
            <ConnectWallet onConnected={() => setShouldRoute(true)} />
          </div>
        </header>

        {/* Hero section */}
        <section className="flex flex-1 flex-col justify-center gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/5 px-4 py-1 text-xs font-medium text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Powered by Polygon &amp; IPFS
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Securing the{" "}
              <span className="text-emerald-400">Pharmaceutical</span>
              <br />
              Supply Chain
            </h1>

            <p className="max-w-xl text-base text-slate-300 sm:text-lg">
              A scalable blockchain-based solution to combat counterfeit drugs.
              Track every batch from manufacturing to consumption with immutable,
              transparent records.
            </p>

            {/* Primary actions – re-use existing wallet component */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="sm:hidden">
                <ConnectWallet onConnected={() => setShouldRoute(true)} />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-6 py-2.5 text-sm font-medium text-slate-200 shadow-sm transition hover:border-slate-500 hover:bg-slate-900"
              >
                <span className="h-4 w-4 rounded-full border border-slate-500/80 bg-slate-900/60" />
                View Whitepaper
              </button>
            </div>
          </div>

          {/* Lifecycle card */}
          <div className="mt-8 w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-950/60 p-6 shadow-xl shadow-emerald-500/10 backdrop-blur lg:mt-0">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Drug Batch Lifecycle
            </p>

            <div className="space-y-6">
              {[
                {
                  label: "Manufacturer",
                  sub: "Drug Production",
                  icon: "shield",
                },
                {
                  label: "Distributor",
                  sub: "Batch Verified",
                  icon: "cube",
                },
                {
                  label: "Retailer",
                  sub: "Supply Transit",
                  icon: "truck",
                },
                {
                  label: "Consumer",
                  sub: "Authenticated",
                  icon: "user",
                },
              ].map((step, index, array) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/80 ring-1 ring-slate-700/80">
                    <span className="text-lg text-emerald-400">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-50">
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-400">{step.sub}</p>
                  </div>
                  {index !== array.length - 1 && (
                    <div className="ml-1 mt-2 h-8 w-px bg-gradient-to-b from-emerald-400/30 via-slate-700/70 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats section */}
        <section className="mt-16 grid gap-8 border-t border-slate-800/80 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-3xl font-semibold text-emerald-400">10%</p>
            <p className="mt-1 text-xs text-slate-400">
              of drugs are counterfeit globally
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-emerald-400">
              &lt;$0.01
            </p>
            <p className="mt-1 text-xs text-slate-400">
              avg. transaction cost on Polygon
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-emerald-400">2s</p>
            <p className="mt-1 text-xs text-slate-400">
              block confirmation time
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-emerald-400">100%</p>
            <p className="mt-1 text-xs text-slate-400">
              immutable audit trail
            </p>
          </div>
        </section>

        {/* Benefits section */}
        <section className="mt-14">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Why Blockchain for Pharma?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm text-slate-300">
              Leveraging decentralized technology to eliminate counterfeit drugs
              and ensure patient safety.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Immutable Records",
                body: "Every drug batch is recorded on Polygon, ensuring tamper-proof traceability from manufacturing to consumption.",
              },
              {
                title: "Full Transparency",
                body: "Real-time visibility into drug movement across the entire supply chain for all authorized stakeholders.",
              },
              {
                title: "Low-Cost Transactions",
                body: "Polygon's Layer 2 solution enables high throughput with minimal gas fees, suitable for large-scale deployment.",
              },
              {
                title: "Decentralized Storage",
                body: "IPFS integration ensures resilient, distributed data storage for pharmaceutical documentation and batch records.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex h-full flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-md shadow-slate-950/40 backdrop-blur"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-slate-50">
                  {card.title}
                </p>
                <p className="text-xs text-slate-300">{card.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-[11px] text-slate-500">
            Based on research by Rajak, Khanal &amp; Ansari — NIT Sikkim ·
            Computers &amp; Industrial Engineering 2026
          </p>
        </section>
      </div>
    </main>
  );
}