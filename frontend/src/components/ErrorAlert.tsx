import React from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';

// Alert component (UI component)
export const Alert = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return (
    <div className={`rounded-lg p-3 sm:p-4 lg:p-6 ${className}`}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return (
    <h3 className={`text-sm sm:text-base lg:text-lg font-semibold leading-none ${className}`}>
      {children}
    </h3>
  );
};

export const AlertDescription = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return <div className={`space-y-1 sm:space-y-2 lg:space-y-3 ${className}`}>{children}</div>;
};

// ErrorAlert component
interface ErrorAlertProps {
  error: {
    id: string;
    message: string;
    timestamp: string;
    severity: 'critical' | 'warning';
  };
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  const severityStyles = {
    critical: {
      container: 'border-red-200 bg-red-50 shadow-sm',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-800',
      timestamp: 'text-red-600',
    },
    warning: {
      container: 'border-yellow-200 bg-yellow-50 shadow-sm',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
      timestamp: 'text-yellow-600',
    },
  };

  const styles = severityStyles[error.severity];

  return (
    <Alert className={`relative overflow-hidden ${styles.container}`}>
      <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
        <AlertTriangle className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 ${styles.icon}`} />

        <div className="flex-1 space-y-2 sm:space-y-3 lg:space-y-4">
          <AlertTitle className={styles.title}>
            {error.severity === 'critical' ? 'Critical Error' : 'Warning'}
          </AlertTitle>

          <AlertDescription>
            <p className={`text-sm sm:text-base lg:text-lg ${styles.message}`}>{error.message}</p>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <Clock className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${styles.timestamp}`} />
              <span className={`text-xs sm:text-sm lg:text-base ${styles.timestamp}`}>{error.timestamp}</span>
            </div>
          </AlertDescription>
        </div>

        <button
          className={`rounded-full p-1 sm:p-2 lg:p-3 transition-colors hover:bg-white/20 focus:ring focus:ring-offset-1 ${styles.icon}`}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </button>
      </div>

      {/* Decorative side border */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 lg:w-2 ${
          error.severity === 'critical' ? 'bg-red-600' : 'bg-yellow-600'
        }`}
      />
    </Alert>
  );
}

export default ErrorAlert;
