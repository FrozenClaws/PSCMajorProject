import { getContract } from "thirdweb";
import { client } from "@/lib/client";
import { polygonAmoy } from "thirdweb/chains";
import { stakeholderMethods } from "./stakeholdermethods";

export const registerStakeholderContract = getContract({
  client,
  address: process.env.NEXT_PUBLIC_STAKEHOLDER_ONBOARDING_CONTRACT_ADDRESS!,
  chain: polygonAmoy,
  abi: [
    stakeholderMethods.registerStakeholder
  ]
});

export const getStakeholderContract = getContract({
    client,
    address: process.env.NEXT_PUBLIC_STAKEHOLDER_ONBOARDING_CONTRACT_ADDRESS!,
    chain: polygonAmoy,
    abi: [
      stakeholderMethods.getStakeholder
    ]
});

export const getRegistrationQueueContract = getContract({
    client,
    address: process.env.NEXT_PUBLIC_STAKEHOLDER_ONBOARDING_CONTRACT_ADDRESS!,
    chain: polygonAmoy,
    abi: [
      stakeholderMethods.getRegistrationQueue
    ]
});