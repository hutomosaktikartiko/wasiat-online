import { useEffect, useRef } from "react";
import { useNotification } from "../providers/notification-provider";

export function useDevnetWarning() {
  const { showWarning } = useNotification();
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (hasShownRef.current) return;
    
    const hasSeenWarning = localStorage.getItem("devnet-warning-seen");
    
    if (!hasSeenWarning) {
      hasShownRef.current = true;
      setTimeout(() => {
        showWarning(
          "🚧 Development Mode",
          "This app runs on Solana Devnet. Your data may be reset anytime. Not for real assets!"
        );
        localStorage.setItem("devnet-warning-seen", "true");
      }, 1000);
    }
  }, [showWarning]);
}