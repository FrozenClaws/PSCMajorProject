import { keccak256, toUtf8Bytes } from "ethers";

export const ROLE_HASH = {
  MANUFACTURER: keccak256(toUtf8Bytes("MANUFACTURER")),
  DISTRIBUTOR: keccak256(toUtf8Bytes("DISTRIBUTOR")),
  WHOLESALER: keccak256(toUtf8Bytes("WHOLESALER")),
  PHARMACY: keccak256(toUtf8Bytes("PHARMACY")),
  CONSUMER: keccak256(toUtf8Bytes("CONSUMER")),
};

export const ROLE_MAP: Record<string, string> = {
  [ROLE_HASH.MANUFACTURER]: "manufacturer",
  [ROLE_HASH.DISTRIBUTOR]: "distributor",
  [ROLE_HASH.WHOLESALER]: "wholesaler",
  [ROLE_HASH.PHARMACY]: "pharmacy",
  [ROLE_HASH.CONSUMER]: "consumer",
};