import { useEffect, useState } from 'react';
import styles from './custom-toast.module.scss';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  title?: string;
  description?: React.ReactNode;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

interface ToastOptions extends Omit<ToastProps, 'id'> {
  id?: string;
}

type ToastFunction = (options: ToastOptions) => string;

interface ToastContextValue {
  toast: ToastFunction;
  success: (options: ToastOptions) => string;
  error: (options: ToastOptions) => string;
  info: (options: ToastOptions) => string;
  warning: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

let toastCounter = 0;
const toastEventTarget = new EventTarget();
const TOAST_ADD = 'TOAST_ADD';
const TOAST_REMOVE = 'TOAST_REMOVE';

export const Toast = ({ id, title, description, type = 'info', duration = 5000, onClose, className }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && duration !== Infinity) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : styles.hidden} ${className || ''}`}
      role="alert"
    >
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        {description && <div className={styles.description}>{description}</div>}
      </div>
      <button className={styles.closeButton} onClick={() => onClose?.()} aria-label="Fechar">
        ×
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handleAdd = (e: CustomEvent<ToastProps>) => {
      setToasts(prev => {
        // Remove toast existente com o mesmo ID
        const filtered = prev.filter(toast => toast.id !== e.detail.id);
        return [...filtered, e.detail];
      });
    };

    const handleRemove = (e: CustomEvent<{ id: string }>) => {
      setToasts(prev => prev.filter(toast => toast.id !== e.detail.id));
    };

    toastEventTarget.addEventListener(TOAST_ADD, handleAdd as EventListener);
    toastEventTarget.addEventListener(TOAST_REMOVE, handleRemove as EventListener);

    return () => {
      toastEventTarget.removeEventListener(TOAST_ADD, handleAdd as EventListener);
      toastEventTarget.removeEventListener(TOAST_REMOVE, handleRemove as EventListener);
    };
  }, []);

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => {
            toast.onClose?.();
            toastEventTarget.dispatchEvent(
              new CustomEvent(TOAST_REMOVE, { detail: { id: toast.id } })
            );
          }}
        />
      ))}
    </div>
  );
};

const createToast = (options: ToastOptions): string => {
  const id = options.id || `toast-${++toastCounter}`;
  toastEventTarget.dispatchEvent(
    new CustomEvent(TOAST_ADD, {
      detail: {
        id,
        ...options,
      },
    })
  );
  return id;
};

export const useToast = (): ToastContextValue => {
  const toast: ToastFunction = (options) => createToast(options);

  return {
    toast,
    success: (options) => createToast({ ...options, type: 'success' }),
    error: (options) => createToast({ ...options, type: 'error' }),
    info: (options) => createToast({ ...options, type: 'info' }),
    warning: (options) => createToast({ ...options, type: 'warning' }),
    dismiss: (id) => {
      toastEventTarget.dispatchEvent(
        new CustomEvent(TOAST_REMOVE, { detail: { id } })
      );
    },
  };
}; 