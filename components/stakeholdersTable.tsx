import { useActiveAccount, useReadContract } from "thirdweb/react";
import { StakeholderContract } from "@/lib/contracts";
import Table from "./table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ROLE_HASH } from "@/lib/rolemap";

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

export default function StakeholdersTable({ role }: { role: string }) {
  const account = useActiveAccount();
  const router = useRouter();

  const { data, isLoading, refetch } = useReadContract({
    contract: StakeholderContract,
    method: "getAllStakeholders",
  });


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
        .filter((s) => s.exists && s.approved);
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

        return parsed.filter((s) => s.exists && s.approved);
      }
    }

    return [];
  }, [data]);

  const handleSeeMore = (address: string) => {
    router.push(`/admin/stakeholder/${address}`);
  };
  if (isLoading) return <div className="text-slate-400">Loading...</div>;
  return (
    stakeholders && stakeholders.length > 0 ? (
      role === "all" ? <Table stakeholders={stakeholders} handleSeeMore={handleSeeMore} /> : <Table stakeholders={stakeholders.filter((s) => s.role === ROLE_HASH[role.toUpperCase() as keyof typeof ROLE_HASH])} handleSeeMore={handleSeeMore} />
    ) : (
      <div className="text-slate-400">No stakeholders found</div>
    )
  );
}