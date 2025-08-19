import { useEffect, useMemo, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CopyHash } from "../ui/copy-button";
import { TransactionStatusBadge } from "../ui/status-badge";
import { getExplorerUrl } from "../../lib/solana/connection";
import { IDL } from "../../lib/anchor/idl";
import { PROGRAM_ID } from "../../lib/utils/constants";
import { Skeleton } from "../ui/skeleton";

type TxItem = {
  signature: string;
  blockTime: number | null;
  status: "success" | "failed";
  type: string; // e.g., create_will, deposit_sol
};

function base64ToBytes(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  } catch {
    return new Uint8Array();
  }
}

function formatType(name: string): string {
  // Convert snake_case to Title Case for display
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

async function fetchProgramTransactions(
  connection: ReturnType<typeof useConnection>["connection"],
  address: PublicKey,
  limit = 10
): Promise<TxItem[]> {
  const programId = new PublicKey(PROGRAM_ID);
  const signatures = await connection.getSignaturesForAddress(address, { limit }, "confirmed");

  const discriminatorMap = new Map<string, string>();
  for (const ix of IDL.instructions as any[]) {
    // key is 8 bytes stringified for quick compare
    const key = (ix.discriminator as number[]).join(",");
    discriminatorMap.set(key, ix.name as string);
  }

  const results = await Promise.all(
    signatures.map(async (sig) => {
      const tx = await connection.getTransaction(sig.signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        return null;
      }

      // Find instruction for our program
      const message = tx.transaction.message;
      const accountKeys = message.getAccountKeys();
      let foundType: string | null = null;

      for (const ix of message.compiledInstructions) {
        const programKey = accountKeys.get(ix.programIdIndex);
        if (programKey && programKey.equals(programId)) {
          const dataBytes = base64ToBytes(ix.data as unknown as string);
          if (dataBytes.length >= 8) {
            const discKey = Array.from(dataBytes.slice(0, 8)).join(",");
            const name = discriminatorMap.get(discKey) || null;
            if (name) {
              foundType = name;
              break;
            }
          }
        }
      }

      return {
        signature: sig.signature,
        blockTime: tx.blockTime ?? null,
        status: tx.meta?.err ? "failed" : "success",
        type: foundType || "Program Interaction",
      } as TxItem;
    })
  );

  return results.filter(Boolean) as TxItem[];
}

export function TxHistory({ willAddress }: { willAddress: PublicKey }) {
  const { connection } = useConnection();
  const [items, setItems] = useState<TxItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addr = useMemo(() => willAddress, [willAddress]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchProgramTransactions(connection, addr, 10)
      .then((txs) => {
        if (!mounted) return;
        setItems(txs);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load transactions");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [connection, addr]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📄 Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : !items || items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No transactions yet.</div>
        ) : (
          <div className="space-y-4">
            {items.map((tx) => (
              <div key={tx.signature} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">{formatType(tx.type)}</div>
                  <div className="text-sm text-muted-foreground">
                    {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString("en-US") : "—"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TransactionStatusBadge status={tx.status} />
                  <a
                    href={getExplorerUrl(tx.signature, "tx")}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs underline"
                  >
                    View
                  </a>
                  <CopyHash hash={tx.signature} label="Tx" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


