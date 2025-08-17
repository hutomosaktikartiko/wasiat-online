import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useWallet } from "../../hooks/use-wallet";
import { useWill } from "../../hooks/use-will";
import { useProgram } from "../../providers/program-provider";
import { 
  DEFAULT_HEARTBEAT_PERIOD,
} from "../../lib/utils/constants";

interface CreateWillFormProps {
  onSuccess?: (willAddress: PublicKey) => void;
  onCancel?: () => void;
}

export function CreateWillForm({ onSuccess, onCancel }: CreateWillFormProps) {
  const wallet = useWallet();
  const { config, program, readOnlyProgram } = useProgram();
  const { createWill, transaction } = useWill(wallet.publicKey || undefined, undefined);
  
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
  const [heartbeatPeriod, setHeartbeatPeriod] = useState(DEFAULT_HEARTBEAT_PERIOD);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Convert seconds to days for display
  const heartbeatDays = Math.floor(heartbeatPeriod / (24 * 60 * 60));
  
  // Get min/max from config or use defaults
  const minDays = config ? Math.floor(config.minHeartbeatPeriod / (24 * 60 * 60)) : 7;
  const maxDays = config ? Math.floor(config.maxHeartbeatPeriod / (24 * 60 * 60)) : 365;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate beneficiary address
    if (!beneficiaryAddress.trim()) {
      newErrors.beneficiary = "Beneficiary address is required";
    } else {
      try {
        const pubkey = new PublicKey(beneficiaryAddress);
        if (wallet.publicKey && pubkey.equals(wallet.publicKey)) {
          newErrors.beneficiary = "Beneficiary cannot be the same as testator";
        }
      } catch {
        newErrors.beneficiary = "Invalid address format";
      }
    }

    // Validate heartbeat period
    if (heartbeatDays < minDays) {
      newErrors.heartbeat = `Minimum heartbeat period is ${minDays} days`;
    } else if (heartbeatDays > maxDays) {
      newErrors.heartbeat = `Maximum heartbeat period is ${maxDays} days`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !wallet.publicKey) return;

    try {
      const beneficiary = new PublicKey(beneficiaryAddress);
      const result = await createWill({
        beneficiary,
        heartbeatPeriod,
      });

      if (result.success) {
        // Calculate will address for callback
        const { getWillPDA } = await import("../../lib/anchor/pda");
        const [willAddress] = getWillPDA(wallet.publicKey, beneficiary);
        onSuccess?.(willAddress);
      }
    } catch (error) {
      console.error("Error creating will:", error);
    }
  };

  const handleHeartbeatDaysChange = (days: number) => {
    const seconds = days * 24 * 60 * 60;
    setHeartbeatPeriod(seconds);
  };

  return (
    <div className="space-y-6">
      {/* Beneficiary */}
      <div className="space-y-2">
        <Label htmlFor="beneficiary">Beneficiary Address *</Label>
        <Input
          id="beneficiary"
          placeholder="Enter Solana address of beneficiary"
          value={beneficiaryAddress}
          onChange={(e) => setBeneficiaryAddress(e.target.value)}
          className={errors.beneficiary ? "border-red-500" : ""}
        />
        {errors.beneficiary && (
          <p className="text-red-500 text-sm">{errors.beneficiary}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Solana address that will receive assets after will is triggered
        </p>
      </div>

      {/* Heartbeat Period */}
      <div className="space-y-2">
        <Label htmlFor="heartbeat">Heartbeat Period (days) *</Label>
        <Input
          id="heartbeat"
          type="number"
          placeholder="90"
          min={minDays}
          max={maxDays}
          value={heartbeatDays}
          onChange={(e) => handleHeartbeatDaysChange(parseInt(e.target.value) || 0)}
          className={errors.heartbeat ? "border-red-500" : ""}
        />
        {errors.heartbeat && (
          <p className="text-red-500 text-sm">{errors.heartbeat}</p>
        )}
        <p className="text-sm text-muted-foreground">
          If you don't send heartbeat within this period, the will be triggered
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Important Information</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• After will is created, you can deposit assets to vault</li>
          <li>• Send heartbeat periodically to prevent automatic trigger</li>
          <li>• You can withdraw assets anytime before will is triggered</li>
          <li>• Small fee will be deducted when beneficiary claims assets</li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleSubmit}
          className="flex-1"
          disabled={!wallet.isConnected || transaction.isLoading}
        >
          {transaction.isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Creating Will...
            </>
          ) : (
            "🚀 Create Will"
          )}
        </Button>
        {onCancel && (
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="flex-1"
            disabled={transaction.isLoading}
          >
            ↩️ Back to Dashboard
          </Button>
        )}
      </div>

      {/* Transaction Status */}
      {transaction.signature && (
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ Will created successfully!
          </p>
          <p className="text-xs text-green-600 mt-1 break-all">
            Signature: {transaction.signature}
          </p>
        </div>
      )}

      {transaction.error && (
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-sm text-red-800">
            ❌ {transaction.error}
          </p>
        </div>
      )}
    </div>
  );
}
