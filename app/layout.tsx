"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { AutoConnect, ThirdwebProvider } from "thirdweb/react";
import { client } from "@/lib/client";
import { polygonAmoy } from "thirdweb/chains";
import AccountGate from "@/components/accountGate";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <AutoConnect
            client={client}
            accountAbstraction={{
              chain: polygonAmoy,
              sponsorGas: true,
            }}
          />
          {isLanding ? children : <AccountGate>{children}</AccountGate>}
        </ThirdwebProvider>
      </body>
    </html>
  );
}