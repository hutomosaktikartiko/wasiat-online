import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading-spinner";
import { CountdownTimer } from "../ui/countdown-timer";
import { useWill } from "../../hooks/use-will";
import { useProgram } from "../../providers/program-provider";
import { formatDate } from "../../lib/utils/format";

interface HeartbeatButtonProps {
  will: any; // WillWithStatus type
  onSuccess?: () => void;
  className?: string;
}

export function HeartbeatButton({ will, onSuccess, className }: HeartbeatButtonProps) {
  const { sendHeartbeat, transaction } = useWill(undefined, undefined, will?.address);
  const { config } = useProgram();

  const handleHeartbeat = async () => {
    const result = await sendHeartbeat();
    
    if (result.success) {
      onSuccess?.();
    }
  };

  // Check if heartbeat is too frequent
  const now = Math.floor(Date.now() / 1000);
  const minInterval = config?.minHeartbeatInterval || 3600; // 1 hour default
  const timeSinceLastHeartbeat = now - will.lastHeartbeat;
  const canSendHeartbeat = timeSinceLastHeartbeat >= minInterval;
  const timeUntilNextHeartbeat = Math.max(0, minInterval - timeSinceLastHeartbeat);

  if (!will.canHeartbeat) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Heartbeat Status */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-blue-900">Status Heartbeat</h3>
          <span className={`text-sm px-2 py-1 rounded ${
            will.isExpired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}>
            {will.isExpired ? "Kedaluwarsa" : "Aktif"}
          </span>
        </div>

        {!will.isExpired ? (
          <div>
            <p className="text-sm text-blue-800 mb-2">
              Waktu tersisa hingga kedaluwarsa:
            </p>
            <CountdownTimer 
              targetTime={will.lastHeartbeat + will.heartbeatPeriod}
              onExpire={() => window.location.reload()}
              className="text-blue-900 font-mono"
            />
          </div>
        ) : (
          <p className="text-sm text-red-600">
            ⚠️ Heartbeat telah kedaluwarsa. Wasiat dapat dipicu oleh keeper.
          </p>
        )}

        <p className="text-xs text-blue-600 mt-2">
          Heartbeat terakhir: {formatDate(will.lastHeartbeat)}
        </p>
      </div>

      {/* Heartbeat Button */}
      <div>
        {!canSendHeartbeat ? (
          <div className="space-y-2">
            <Button 
              disabled 
              className="w-full"
              variant="outline"
            >
              💓 Heartbeat Terlalu Sering
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Tunggu {Math.floor(timeUntilNextHeartbeat / 60)} menit {timeUntilNextHeartbeat % 60} detik 
              sebelum mengirim heartbeat lagi
            </p>
          </div>
        ) : (
          <Button 
            onClick={handleHeartbeat}
            disabled={transaction.isLoading}
            className="w-full"
            size="lg"
          >
            {transaction.isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Mengirim Heartbeat...
              </>
            ) : (
              <>
                💓 Kirim Heartbeat
              </>
            )}
          </Button>
        )}
      </div>

      {/* Heartbeat Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>ℹ️ Tentang Heartbeat:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Kirim heartbeat secara berkala untuk membuktikan Anda masih aktif</li>
          <li>Heartbeat akan mereset timer ke periode awal ({Math.floor(will.heartbeatPeriod / (24 * 60 * 60))} hari)</li>
          <li>Minimal interval: {Math.floor(minInterval / 60)} menit</li>
          <li>Jika timer habis, wasiat akan dipicu otomatis oleh sistem</li>
        </ul>
      </div>

      {/* Transaction Status */}
      {transaction.signature && (
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ Heartbeat berhasil dikirim!
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
