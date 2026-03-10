import { prepareEvent } from "thirdweb";

const stakeholderRegisteredEvent = prepareEvent({
  signature: "event StakeholderRegistered(address indexed user, bytes32 role)"
});
const stakeholderApprovedEvent = prepareEvent({
  signature: "event StakeholderApproved(address indexed user, bytes32 role)"
});
const stakeholderRejectedEvent = prepareEvent({
  signature: "event StakeholderRejected(address indexed user)"
});
const stakeholderUpdatedEvent = prepareEvent({
  signature: "event StakeholderUpdated(address indexed user)"
});
