"use client";

import { ReactNode } from "react";
import { ReactQueryClientProvider } from "@/clients/react-query/client";

interface ProvidersProps {
	children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
	return <ReactQueryClientProvider>{children}</ReactQueryClientProvider>;
}
