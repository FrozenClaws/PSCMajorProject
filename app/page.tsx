"use client";

import { useActiveAccount, useReadContract } from "thirdweb/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ConnectWallet from "@/components/connectWallet";
import { getStakeholderContract as contract } from "@/lib/contracts";

export default function Home() {
  const account = useActiveAccount();
  const router = useRouter();

  const { data, isLoading } = useReadContract({
    contract,
    method: "getStakeholder",
    params: [account?.address as string],
    queryOptions: {
      enabled: !!account,
    },
  });

  useEffect(() => {
    if (!account || isLoading) return;

    if (!data || data.exists === false) {
      router.push("/register");
    } else {
      console.log("User exists:", data);
    }
  }, [account, data, isLoading]);

  return (
    <div>
      <ConnectWallet />
    </div>
  );
}