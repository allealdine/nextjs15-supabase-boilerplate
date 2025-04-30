"use client";

import * as Toast from "@radix-ui/react-toast";
import { ReactNode, createContext, useContext, useState } from "react";

type ToastData = { title: string; description?: string };

interface ToastContextType {
  showToast: (data: ToastData) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<ToastData>({ title: "", description: "" });

  const showToast = (data: ToastData) => {
    setToast(data);
    setOpen(false); // reset if already open
    setTimeout(() => setOpen(true), 10); // delay to re-trigger
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}
        <Toast.Root
          className="fixed bottom-4 right-4 z-50 rounded-lg bg-black text-white p-4 shadow-lg animate-in fade-in slide-in-from-bottom-2"
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="font-semibold">{toast.title}</Toast.Title>
          {toast.description && (
            <Toast.Description className="text-sm mt-1">
              {toast.description}
            </Toast.Description>
          )}
          <Toast.Close className="absolute top-2 right-2 text-white text-sm hover:opacity-70">
            ✕
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};
