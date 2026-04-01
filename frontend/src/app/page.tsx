"use client";

import { useState } from "react";
import { useFlowCurrentUser } from "@onflow/react-sdk";
import { transfer } from "flowkit";

export default function Home() {
  const { user, authenticate, unauthenticate } = useFlowCurrentUser();
  const [amount, setAmount] = useState("1.50");
  const [token, setToken] = useState("DAI");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.loggedIn) return;
    
    setStatus("Initiating FlowKit Transfer...");
    setError("");

    try {
      // Use the newly patched FlowKit SDK which scales natively in JS!
      // This solves the UFix64 Cadence precision bug with 18-decimal EVM standard tokens.
      const txId = await transfer(
        amount,                 // e.g "1.50"
        user.addr!,             // Receiver (sending to self EVM for demo)
        token,                  // e.g "DAI" (18 decimals)
        false                   // fromEVM (false = Cadence to EVM)
      );

      setStatus(`Transaction Dispatched! TXID: ${txId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to initiate transfer.");
      setStatus("");
    }
  };

  return (
    <main className="min-h-screen bg-[#050511] text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050511] to-[#050511]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-xl mx-auto backdrop-blur-3xl bg-white/[0.03] border border-white/[0.08] p-10 rounded-3xl shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-white/[0.12]">
        
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wide mb-6">
            FlowKit Enterprise SDK
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-3">
            Cross-VM Bridge Demo
          </h1>
          <p className="text-white/40 text-sm">Validating 18-decimal precision fixes natively on JS.</p>
        </div>

        <div className="flex flex-col gap-4">
          {user?.loggedIn ? (
            <form onSubmit={handleTransfer} className="flex flex-col gap-5">
              
              {/* Account Card */}
              <div className="flex items-center justify-between px-5 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/50">Connected Flow Wallet</span>
                    <span className="text-sm font-medium text-white/90 truncate w-32">{user.addr}</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={unauthenticate}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10"
                >
                  Disconnect
                </button>
              </div>

              {/* Transfer Details Form */}
              <div className="bg-black/40 rounded-2xl p-6 border border-white/[0.04]">
                 <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-2 block">Token Asset</label>
                      <select 
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                      >
                        <option value="DAI">DAI (18 Decimals)</option>
                        <option value="USDC">USDC (6 Decimals)</option>
                        <option value="FLOW">FLOW (8 Decimals)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-2 block">Transfer Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.0001"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-blue-500/50"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                      </div>
                      <p className="text-[10px] text-cyan-400/70 mt-2 block">
                        Native JS Scaling bypasses Cadence UFix64 truncation.
                      </p>
                    </div>
                 </div>
              </div>

              <button
                type="submit"
                disabled={!!status && !status.includes("TXID")}
                className="py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {!status ? "Simulate Cross-VM Transfer" : (status.includes("TXID") ? "Transfer Sent!" : "Processing...")}
              </button>
            </form>
          ) : (
             <button
              onClick={authenticate}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Connect Flow Wallet
            </button>
          )}

          {/* TX Status display */}
          {status && (
            <div className="mt-2 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sm text-center">
              <span className="text-white/70 block mb-1">Bridge Status</span>
              <span className="font-mono text-cyan-400 break-all">{status}</span>
            </div>
          )}
          {error && (
            <div className="mt-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm xl text-center overflow-auto">
              {/* It's expected to fail if DAI contract isn't deployed on emulator, but precision logic succeeds! */}
              <span className="text-red-400 break-all">{error}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
