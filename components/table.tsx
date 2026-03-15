import { useMemo, useState } from "react";
import { ROLE_MAP } from "@/lib/rolemap";

type TableProps = {
  stakeholders: Stakeholder[];
  handleSeeMore: (address: string) => void;
};

type Stakeholder = {
  user: string;
  name: string;
  role: string;
  location: string;
  license: string;
  approved: boolean;
  exists: boolean;
};

const PAGE_SIZE = 10;

export default function Table({ stakeholders, handleSeeMore }: TableProps) {
  const [page, setPage] = useState(1);

  const { currentPageItems, totalPages } = useMemo(() => {
    const totalPagesCalc = Math.max(
      1,
      Math.ceil((stakeholders?.length ?? 0) / PAGE_SIZE)
    );
    const safePage = Math.min(page, totalPagesCalc);
    const start = (safePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return {
      currentPageItems: stakeholders.slice(start, end),
      totalPages: totalPagesCalc,
    };
  }, [stakeholders, page]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const handlePrev = () => {
    if (canPrev) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (canNext) setPage((p) => p + 1);
  };

  return (
    <div className="space-y-3">
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
            {currentPageItems.map((s) => {
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

      {stakeholders.length > 0 && (
        <div className="flex items-center justify-center gap-4 text-xs text-slate-300">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canPrev}
            className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 font-medium text-slate-200 shadow-sm transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500 disabled:hover:bg-slate-900/70"
          >
            Prev
          </button>
          <span className="min-w-[80px] text-center text-slate-300">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canNext}
            className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 font-medium text-slate-200 shadow-sm transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500 disabled:hover:bg-slate-900/70"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}