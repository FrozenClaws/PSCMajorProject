'use client';

import { Inter } from "next/font/google";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient} from "@tanstack/react-query";
import { ReactNode, useState } from "react";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}