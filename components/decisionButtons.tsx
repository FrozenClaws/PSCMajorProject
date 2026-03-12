import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, waitForReceipt } from "thirdweb";
import { StakeholderContract } from "@/lib/contracts";
import { client } from "@/lib/client";
import { polygonAmoy as chain } from "thirdweb/chains";

type ApproveRejectProps = {
    user: string;
    onSuccess?: () => void;
    disabled?: boolean;
    onError?: (error: unknown) => void;
};

export function ApproveStakeholderTx({
    user,
    onSuccess,
    disabled,
    onError,
}: ApproveRejectProps) {

    const { mutate: sendTx, isPending } = useSendTransaction();
    const handleApprove = () => {
        const tx = prepareContractCall({
            contract: StakeholderContract,
            method: "approveStakeholder",
            params: [user],
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
                console.error("ApproveStakeholder transaction error:", error);
                onError?.(error);
            },
        });
    };
    return (
        <button
            type="button"
            onClick={disabled ? undefined : handleApprove}
            disabled={isPending || disabled}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/60 bg-emerald-500/90 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:border-emerald-500/40 disabled:bg-emerald-500/50"
        >
            {isPending ? "Approving..." : "Approve"}
        </button>
    );
}

export function RejectStakeholderTx({
    user,
    onSuccess,
    disabled,
    onError,
}: ApproveRejectProps) {

    const { mutate: sendTx, isPending } = useSendTransaction();
    const handleReject = () => {
        const tx = prepareContractCall({
            contract: StakeholderContract,
            method: "rejectStakeholder",
            params: [user],
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
                console.error("RejectStakeholder transaction error:", error);
                onError?.(error);
            },
        });
    };
    return (
        <button
            type="button"
            onClick={disabled ? undefined : handleReject}
            disabled={isPending || disabled}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/60 bg-red-500/90 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-sm shadow-red-500/40 transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:border-red-500/40 disabled:bg-red-500/50"
        >
            {isPending ? "Rejecting..." : "Reject"}
        </button>
    );
}

