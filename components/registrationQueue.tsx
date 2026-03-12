"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { StakeholderContract } from "@/lib/contracts";
import { ROLE_MAP } from "@/lib/rolemap";

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

export default function RegistrationQueue() {
  const account = useActiveAccount();
  const router = useRouter();

  console.log(account?.address);

  const { data, isLoading } = useReadContract({
    contract: StakeholderContract,
    method: "getRegistrationQueue",
    queryOptions: {
       enabled: !!account,
    },
  });

  console.log(data);

  const stakeholders: Stakeholder[] = useMemo(() => {
    if (!data) return [];

    // Case 1: Direct array of tuples / objects (standard thirdweb output)
    if (Array.isArray(data)) {
      const raw = data as any[];
      return raw
        .map((item) => {
          if (Array.isArray(item)) {
            return {
              user: item[0] as string,
              name: item[1] as string,
              role: item[2] as string,
              location: item[3] as string,
              detailsIPFSURL: item[4] as string,
              license: item[5] as string,
              approved: item[6] as boolean,
              exists: item[7] as boolean,
            } satisfies Stakeholder;
          }

          return item as Stakeholder;
        })
        .filter((s) => s.exists && !s.approved);
    }

    // Case 2: Encoded as { "0": "tuple(...)[]: addr,name,role,location,ipfs,license,approved,exists" }
    if (
      typeof data === "object" &&
      data !== null &&
      Object.prototype.hasOwnProperty.call(data as any, "0")
    ) {
      const rawValue = (data as any)["0"];
      if (typeof rawValue === "string") {
        // Support multiple tuples separated by ';' if contract ever returns more than one
        const afterColon = rawValue.split(":").slice(1).join(":").trim();
        if (!afterColon) return [];

        const tupleStrings = afterColon
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean);

        const parsed = tupleStrings
          .map((tuple) => {
            const parts = tuple.split(",").map((p) => p.trim());
            if (parts.length < 8) return null;

            const [
              user,
              name,
              role,
              location,
              detailsIPFSURL,
              license,
              approvedStr,
              existsStr,
            ] = parts;

            return {
              user,
              name,
              role,
              location,
              detailsIPFSURL,
              license,
              approved: approvedStr === "true",
              exists: existsStr === "true",
            } as Stakeholder;
          })
          .filter((s): s is Stakeholder => !!s);

        return parsed.filter((s) => s.exists && !s.approved);
      }
    }

    return [];
  }, [data]);

  const handleSeeMore = (address: string) => {
    router.push(`/admin/stakeholder/${address}`);
  };

  return (
    <div className="w-full rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-emerald-500/10 backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Registration Queue
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Pending stakeholder registrations awaiting approval.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          {isLoading ? "Loading..." : `${stakeholders.length} pending`}
        </span>
      </div>

      {stakeholders.length === 0 && !isLoading ? (
        <p className="text-sm text-slate-400">
          No stakeholders are currently in the registration queue.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  License ID
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/40">
              {stakeholders.map((s) => {
                const roleLabel = ROLE_MAP[s.role as string] ?? s.role;
                return (
                  <tr key={s.user} className="hover:bg-slate-900/60">
                    <td className="max-w-[180px] truncate px-4 py-3 text-xs font-mono text-slate-300">
                      {s.user}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-100">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-200">
                      {roleLabel}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-200">
                      {s.location}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-200">
                      {s.license}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      <button
                        type="button"
                        onClick={() => handleSeeMore(s.user)}
                        className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
                      >
                        See more
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}