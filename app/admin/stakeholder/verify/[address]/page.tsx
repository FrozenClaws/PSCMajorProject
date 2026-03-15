"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useReadContract } from "thirdweb/react";
import "@/app/globals.css";
import LogoutButton from "@/components/logoutButton";
import { StakeholderContract } from "@/lib/contracts";
import { ROLE_MAP } from "@/lib/rolemap";
import {
  ApproveStakeholderTx,
  RejectStakeholderTx,
} from "@/components/decisionButtons";

type Stakeholder = {
  user: string;
  name: string;
  role: string;
  location: string;
  detailsIPFSURL: string;
  license: string;
  approved: boolean;
  exists: boolean;
};

function ipfsToHttps(url: string | undefined | null): string | null {
  if (!url) return null;
  if (!url.startsWith("ipfs://")) return url;

  const path = url.replace("ipfs://", "").replace(/^ipfs\//, "");
  return `https://ipfs.io/ipfs/${path}`;
}

export default function StakeholderDetailPage() {
  const params = useParams<{ address: string }>();
  const router = useRouter();
  const address = params.address;

  const { data, isLoading } = useReadContract({
    contract: StakeholderContract,
    method: "getStakeholder",
    params: [address],
  });

  const stakeholder: Stakeholder | null = useMemo(() => {
    if (!data) return null;

    if (Array.isArray(data)) {
      return {
        user: data[0] as string,
        name: data[1] as string,
        role: data[2] as string,
        location: data[3] as string,
        detailsIPFSURL: data[4] as string,
        license: data[5] as string,
        approved: data[6] as boolean,
        exists: data[7] as boolean,
      };
    }

    return data as Stakeholder;
  }, [data]);

  const ipfsHttpUrl = ipfsToHttps(stakeholder?.detailsIPFSURL);
  const roleLabel = stakeholder?.role
    ? ROLE_MAP[stakeholder.role as string] ?? stakeholder.role
    : "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_55%,_#000_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(148,163,184,0.12)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.12)_1px,_transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-8 lg:px-10 lg:py-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/40">
              <span className="text-sm font-semibold text-emerald-400">Rx</span>
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                Stakeholder Details
              </p>
              <p className="text-xs text-slate-400">
                Review registration information before approval
              </p>
            </div>
          </div>

          <LogoutButton />
        </header>

        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-emerald-300"
        >
          ← Back to queue
        </button>

        <section className="flex-1">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-emerald-500/10 backdrop-blur">
            {isLoading && (
              <p className="text-sm text-slate-400">Loading stakeholder...</p>
            )}

            {!isLoading && (!stakeholder || !stakeholder.exists) && (
              <p className="text-sm text-red-300">
                Stakeholder record not found for this address.
              </p>
            )}

            {!isLoading && stakeholder && stakeholder.exists && (
              <>
                <div className="mb-6 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                    {stakeholder.approved ? "Approved" : "Pending Approval"}
                  </p>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {stakeholder.name || "Unnamed Stakeholder"}
                  </h1>
                  <p className="text-xs text-slate-400">
                    Address:{" "}
                    <span className="font-mono text-slate-200">
                      {stakeholder.user}
                    </span>
                  </p>
                </div>

                <dl className="grid gap-4 text-sm sm:grid-cols-2">
                  <div className="space-y-1 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                      Role
                    </dt>
                    <dd className="text-slate-100">{roleLabel}</dd>
                  </div>
                  <div className="space-y-1 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                      Location
                    </dt>
                    <dd className="text-slate-100">{stakeholder.location}</dd>
                  </div>
                  <div className="space-y-1 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                      License ID
                    </dt>
                    <dd className="text-slate-100">{stakeholder.license}</dd>
                  </div>
                  <div className="space-y-1 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                      Approval Status
                    </dt>
                    <dd className="text-slate-100">
                      {stakeholder.approved ? "Approved" : "Pending"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    IPFS Document
                  </p>
                  {ipfsHttpUrl ? (
                    <a
                      href={ipfsHttpUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-300 underline-offset-2 hover:underline"
                    >
                      View supporting document on ipfs.io
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400">
                      No IPFS URL provided.
                    </p>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <ApproveStakeholderTx
                    user={stakeholder.user}
                    disabled={stakeholder.approved}
                    onSuccess={() => router.push("/admin")}
                  />
                  <RejectStakeholderTx
                    user={stakeholder.user}
                    disabled={stakeholder.approved}
                    onSuccess={() => router.push("/admin")}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

