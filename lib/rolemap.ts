import { keccak256, toUtf8Bytes } from "ethers";

export const ROLE_HASH = {
  ADMIN: keccak256(toUtf8Bytes("ADMIN")) as `0x${string}`,
  MANUFACTURER: keccak256(toUtf8Bytes("MANUFACTURER")) as `0x${string}`,
  DISTRIBUTOR: keccak256(toUtf8Bytes("DISTRIBUTOR")) as `0x${string}`,
  WHOLESALER: keccak256(toUtf8Bytes("WHOLESALER")) as `0x${string}`,
  PHARMACY: keccak256(toUtf8Bytes("PHARMACY")) as `0x${string}`,
  CONSUMER: keccak256(toUtf8Bytes("CONSUMER")) as `0x${string}`,
};

export const ROLE_MAP: Record<string, string> = {
  [ROLE_HASH.MANUFACTURER]: "manufacturer",
  [ROLE_HASH.DISTRIBUTOR]: "distributor",
  [ROLE_HASH.WHOLESALER]: "wholesaler",
  [ROLE_HASH.PHARMACY]: "pharmacy",
  [ROLE_HASH.CONSUMER]: "consumer",
};