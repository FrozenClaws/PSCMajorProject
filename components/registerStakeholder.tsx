"use client";

import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { StakeholderContract } from "@/lib/contracts";
import { waitForReceipt } from "thirdweb";
import { client } from "@/lib/client";
import { polygonAmoy as chain } from "thirdweb/chains";
import { ROLE_HASH } from "@/lib/rolemap";
import { useActiveAccount } from "thirdweb/react";

type RegisterProps = {
  name: string;
  role: string;
  location: string;
  detailsIPFSURL: string;
  license: string;
  onSuccess?: () => void;
  disabled?: boolean;
  onError?: (error: unknown) => void;
};

export default function RegisterStakeholderTx({
  name,
  role,
  location,
  detailsIPFSURL,
  license,
  onSuccess,
  disabled,
  onError,
}: RegisterProps) {
  const account = useActiveAccount();
  console.log(account);
  const { mutate: sendTx, isPending } = useSendTransaction();

  const handleRegister = () => {
    const tx = prepareContractCall({
      contract: StakeholderContract,
      method: "registerStakeholder",
      params: [name, role, location, detailsIPFSURL, license],
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
        console.error("RegisterStakeholder transaction error:", error);
        onError?.(error);
      },
    });
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : handleRegister}
      disabled={isPending || disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/50 bg-emerald-500/90 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:border-emerald-500/40 disabled:bg-emerald-500/50"
    >
      {isPending ? (
        <>
          <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-emerald-900 border-t-transparent" />
          Registering...
        </>
      ) : (
        "Register"
      )}
    </button>
  );
}

