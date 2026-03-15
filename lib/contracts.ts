import { getContract } from "thirdweb";
import { client } from "@/lib/client";
import { polygonAmoy } from "thirdweb/chains";
import { stakeholderMethods } from "./stakeholdermethods";

export const StakeholderContract = getContract({
    client,
    address: process.env.NEXT_PUBLIC_STAKEHOLDER_ONBOARDING_CONTRACT_ADDRESS!,
    chain: polygonAmoy,
    abi: [
      stakeholderMethods.registerStakeholder,
      stakeholderMethods.getStakeholder,
      stakeholderMethods.isInRegistrationQueue,
      stakeholderMethods.getRegistrationQueue,
      stakeholderMethods.stakeholdersByRole,
      stakeholderMethods.stakeholders,
      stakeholderMethods.registrationQueue,
      stakeholderMethods.registrationQueueIndex,
      stakeholderMethods.approveStakeholder,
      stakeholderMethods.rejectStakeholder,  
      stakeholderMethods.hasRole,
      stakeholderMethods.revokeRole,
      stakeholderMethods.getAllStakeholders,
      stakeholderMethods.updateRegistration,
    ]
});

