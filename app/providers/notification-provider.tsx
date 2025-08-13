import React, { createContext, useContext } from "react";
import { Toaster, toast } from "sonner";

interface NotificationContextType {
  showSuccess: (message: React.ReactNode, description?: React.ReactNode) => void;
  showError: (message: React.ReactNode, description?: React.ReactNode) => void;
  showInfo: (message: React.ReactNode, description?: React.ReactNode) => void;
  showWarning: (message: React.ReactNode, description?: React.ReactNode) => void;
  showLoading: (message: string) => string | number;
  dismissLoading: (id: string | number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const showSuccess = (message: React.ReactNode, description?: React.ReactNode) => {
    toast.success(message, {
      description,
      duration: 5000,
    });
  };

  const showError = (message: React.ReactNode, description?: React.ReactNode) => {
    toast.error(message, {
      description,
      duration: 7000,
    });
  };

  const showInfo = (message: React.ReactNode, description?: React.ReactNode) => {
    toast.info(message, {
      description,
      duration: 5000,
    });
  };

  const showWarning = (message: React.ReactNode, description?: React.ReactNode) => {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      duration: Infinity,
    });
  };

  const dismissLoading = (id: string | number) => {
    toast.dismiss(id);
  };

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismissLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster 
        position="bottom-right"
        expand={true}
        richColors={true}
        closeButton={true}
        toastOptions={{
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
