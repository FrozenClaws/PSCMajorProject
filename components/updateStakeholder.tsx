"use client";

import { prepareContractCall, waitForReceipt } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { StakeholderContract } from "@/lib/contracts";
import { client } from "@/lib/client";
import { polygonAmoy as chain } from "thirdweb/chains";

type UpdateProps = {
  name: string;
  location: string;
  role: string;
  detailsIPFSURL: string;
  license: string;
  onSuccess?: () => void;
  disabled?: boolean;
  onError?: (error: unknown) => void;
};

export default function UpdateStakeholderTx({
  name,
  location,
  role, 
  detailsIPFSURL,
  license,
  onSuccess,
  disabled,
  onError,
}: UpdateProps) {
  const { mutate: sendTx, isPending } = useSendTransaction();

  const handleUpdate = () => {
    const tx = prepareContractCall({
      contract: StakeholderContract,
      method: "updateRegistration",
      params: [name, location, role, detailsIPFSURL, license],
    });

    sendTx(tx, {
      onSuccess: async (result) => {
        console.log("Tx Hash:", result.transactionHash);
        const receipt = await waitForReceipt({
          client,
          chain,
          transactionHash: result.transactionHash,
        });
        console.log("Receipt:", receipt);
        console.log("Logs:", receipt.logs);
        onSuccess?.();
      },
      onError: (error) => {
        console.error("UpdateStakeholder transaction error:", error);
        onError?.(error);
      },
    });
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : handleUpdate}
      disabled={isPending || disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/50 bg-emerald-500/90 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:border-emerald-500/40 disabled:bg-emerald-500/50"
    >
      {isPending ? (
        <>
          <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-emerald-900 border-t-transparent" />
          Updating...
        </>
      ) : (
        "Update"
      )}
    </button>
  );
}