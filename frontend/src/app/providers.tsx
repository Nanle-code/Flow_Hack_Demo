"use client";

import { FlowProvider } from "@onflow/react-sdk";
import flowJson from "../flow.json";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FlowProvider
      config={{
        accessNodeUrl: "http://127.0.0.1:8888",
        flowNetwork: "emulator",
        discoveryWallet: "http://localhost:8701/fcl/authn",
      }}
      flowJson={flowJson}
    >
      {children}
    </FlowProvider>
    );
}
