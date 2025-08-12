import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useWallet } from "../../hooks/use-wallet";
import { useWill } from "../../hooks/use-will";
import { MIN_SOL_AMOUNT, MAX_SOL_AMOUNT } from "../../lib/utils/constants";
import { formatSOL } from "../../lib/utils/format";

interface DepositFormProps {
  willAddress: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DepositForm({ willAddress, onSuccess, onCancel }: DepositFormProps) {
  const wallet = useWallet();
  const { depositSOL, transaction, will } = useWill(
    undefined,
    undefined,
    willAddress ? new PublicKey(willAddress) : undefined
  );
  
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const validateAmount = (value: string): boolean => {
    const num = parseFloat(value);
    
    if (isNaN(num) || num <= 0) {
      setError("Jumlah harus lebih besar dari 0");
      return false;
    }
    
    if (num < MIN_SOL_AMOUNT) {
      setError(`Deposit minimal ${MIN_SOL_AMOUNT} SOL`);
      return false;
    }
    
    if (num > MAX_SOL_AMOUNT) {
      setError(`Deposit maksimal ${MAX_SOL_AMOUNT} SOL`);
      return false;
    }
    
    if (num > wallet.balance - 0.01) { // Reserve for transaction fees
      setError("Saldo tidak mencukupi (sisakan untuk biaya transaksi)");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value) {
      validateAmount(value);
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAmount(amount)) return;
    
    const result = await depositSOL(parseFloat(amount));
    
    if (result.success) {
      onSuccess?.();
    }
  };

  const setMaxAmount = () => {
    const maxDeposit = Math.max(0, wallet.balance - 0.01); // Reserve for fees
    setAmount(maxDeposit.toString());
    validateAmount(maxDeposit.toString());
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center mb-2">Deposit SOL</h2>
          <p className="text-gray-600 text-center text-sm">
            Setor SOL ke vault wasiat Anda
          </p>
        </div>

        {/* Current Status */}
        {will && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-800">Saldo Vault Saat Ini:</span>
              <span className="font-bold text-blue-900">
                {formatSOL(will.vaultBalance)} SOL
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-800">Saldo Wallet:</span>
              <span className="font-bold text-blue-900">
                {formatSOL(wallet.balance)} SOL
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Jumlah SOL <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.001"
                placeholder="0.000"
                value={amount}
                onChange={handleAmountChange}
                className={`pr-20 ${error ? "border-red-500" : ""}`}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={setMaxAmount}
                  className="h-6 px-2 text-xs"
                >
                  MAX
                </Button>
                <span className="text-sm text-gray-500">SOL</span>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>

          {/* Amount Info */}
          {amount && !error && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Jumlah Deposit:</span>
                <span className="font-medium">{amount} SOL</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Estimasi Biaya Transaksi:</span>
                <span className="font-medium">~0.001 SOL</span>
              </div>
              <div className="flex justify-between text-sm mt-1 pt-2 border-t border-gray-200">
                <span>Saldo Setelah Deposit:</span>
                <span className="font-medium">
                  {formatSOL(wallet.balance - parseFloat(amount) - 0.001)} SOL
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={transaction.isLoading}
              >
                Batal
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !wallet.isConnected || 
                !amount || 
                !!error || 
                transaction.isLoading
              }
            >
              {transaction.isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Memproses...
                </>
              ) : (
                "Deposit SOL"
              )}
            </Button>
          </div>
        </form>

        {/* Transaction Status */}
        {transaction.signature && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Deposit berhasil!
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

        {/* Deposit Guidelines */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>📝 Catatan:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Deposit minimal: {MIN_SOL_AMOUNT} SOL</li>
            <li>Deposit maksimal: {MAX_SOL_AMOUNT} SOL</li>
            <li>Biaya transaksi ~0.001 SOL akan dipotong dari wallet</li>
            <li>Setelah deposit, status wasiat akan berubah menjadi "Aktif"</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
