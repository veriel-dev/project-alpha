// src/stores/toastStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Define nombres de acciones para el devtools
const actionNames = {
  addToast: 'toast/addToast',
  removeToast: 'toast/removeToast'
};

interface ToastState {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const useToast = create<ToastState>()(
  devtools(
    (set) => ({
      toasts: [],

      addToast: (type, message, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        set(
          (state) => ({
            toasts: [...state.toasts, { id, type, message, duration }],
          }),
          false,
          {
            type: actionNames.addToast,
            toastType: type,
            message
          }
        );

        // Remover el toast después de la duración especificada
        setTimeout(() => {
          set(
            (state) => ({
              toasts: state.toasts.filter((toast) => toast.id !== id),
            }),
            false,
            {
              type: actionNames.removeToast,
              id,
              cause: 'timeout'
            }
          );
        }, duration);
      },

      removeToast: (id) => {
        set(
          (state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
          }),
          false,
          {
            type: actionNames.removeToast,
            id,
            cause: 'manual'
          }
        );
      },
    }),
    {
      name: 'Toast Store',
      enabled: import.meta.env.DEV
    }
  )
);

export default useToast;