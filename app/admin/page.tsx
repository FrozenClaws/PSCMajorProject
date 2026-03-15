"use client";

import "@/app/globals.css";
import LogoutButton from "@/components/logoutButton";
import RegistrationQueue from "@/components/registrationQueue";
import { useState } from "react";
import StakeholdersTable from "@/components/stakeholdersTable";

export default function AdminPage() {
  const [roleView, setRoleView] = useState<string>("all");
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_55%,_#000_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(148,163,184,0.12)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.12)_1px,_transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10 lg:py-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/40">
              <span className="text-sm font-semibold text-emerald-400">Rx</span>
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                PharmaChain Admin
              </p>
              <p className="text-xs text-slate-400">
                Review and manage stakeholders
              </p>
            </div>
          </div>

          <LogoutButton />
        </header>

        <section className="flex-1 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Stakeholder Verification Queue
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Pending registrations awaiting manual review and approval.
                </p>
              </div>
            </div>
            <RegistrationQueue />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Approved Stakeholders
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter by role:</span>
                <select
                  className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 shadow-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  onChange={(e) => setRoleView(e.target.value)}
                  value={roleView}
                >
              <option value="all">All</option>
              <option value="MANUFACTURER">Manufacturer</option>
              <option value="DISTRIBUTOR">Distributor</option>
              <option value="WHOLESALER">Wholesaler</option>
              <option value="PHARMACY">Pharmacy</option>
              <option value="CONSUMER">Consumer</option>
                </select>
              </div>
            </div>
            <StakeholdersTable role={roleView} />
          </div>
        </section>
      </div>
    </main>
  );
}

