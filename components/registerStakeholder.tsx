"use client";

import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { registerStakeholderContract } from "@/lib/contracts";
import { waitForReceipt } from "thirdweb";
import { client } from "@/lib/client";
import { polygonAmoy as chain } from "thirdweb/chains";

type Props = {
  name: string;
  role: string;
  location: string;
  detailsIPFSURL: string;
  license: string;
  onSuccess?: () => void;
};

export default function RegisterStakeholderTx({
  name,
  role,
  location,
  detailsIPFSURL,
  license,
  onSuccess
}: Props) {

  const { mutate: sendTx, isPending } = useSendTransaction();


  const handleRegister = () => {

    const tx = prepareContractCall({
      contract: registerStakeholderContract,
      method: "registerStakeholder",
      params: [
        name,
        role,
        location,
        detailsIPFSURL,
        license
      ]
    });

    sendTx(tx, {onSuccess: async (result) => {
        console.log("Tx Hash:", result.transactionHash);
        const receipt = await waitForReceipt({
            client,
            chain,
            transactionHash: result.transactionHash,
        });
        console.log("Receipt:", receipt);
        console.log("Logs:", receipt.logs);
    },
    });
  };

  return (
    <button
      onClick={handleRegister}
      disabled={isPending}
      className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
    >
      {isPending ? "Registering..." : "Register On-Chain"}
    </button>
  );
}