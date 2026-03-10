"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient} from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
      <ThirdwebProvider>
        {children}
      </ThirdwebProvider>
  );
}