"use client";
import { polygonAmoy } from "thirdweb/chains";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";

export const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "wallet"],
    },
  }),
];

type Props = {
  onConnected?: () => void;
};

export default function ConnectWallet({ onConnected }: Props) {
  return (
    <ConnectButton
      client={client}
      connectButton={{ label: "Sign in" }}
      accountAbstraction={{
        chain: polygonAmoy,
        sponsorGas: true,
      }}
      connectModal={{
        privacyPolicyUrl:
          "https://playground.thirdweb.com/wallets/sign-in/button?tab=modal",
        showThirdwebBranding: false,
        size: "compact",
        termsOfServiceUrl:
          "https://playground.thirdweb.com/wallets/sign-in/button?tab=modal",
      }}
      wallets={wallets}
      theme={darkTheme({
        colors: {
          primaryButtonBg: "hsl(200, 100%, 55%)",
        },
        //fontFamily: "Roboto",
      })}
      onConnect={() => {
        onConnected?.();
      }}
    />
  );
}