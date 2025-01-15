import React from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';

// Alert component (UI component)
export const Alert = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return (
    <div className={`rounded-lg p-4 sm:p-6 lg:p-8 ${className}`}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return (
    <h3 className={`text-base sm:text-lg lg:text-xl font-semibold leading-tight ${className}`}>
      {children}
    </h3>
  );
};

export const AlertDescription = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return <div className={`space-y-2 sm:space-y-3 lg:space-y-4 ${className}`}>{children}</div>;
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
      container: 'border-red-200 bg-red-50 shadow',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-800',
      timestamp: 'text-red-600',
      border: 'bg-red-600',
    },
    warning: {
      container: 'border-yellow-200 bg-yellow-50 shadow',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
      timestamp: 'text-yellow-600',
      border: 'bg-yellow-600',
    },
  };

  const styles = severityStyles[error.severity];

  return (
    <Alert className={`relative ${styles.container}`}>
      <div className="flex sm:flex-col items-start gap-4 sm:gap-4 lg:gap-8 sm:w-full">
        {/* Severity Icon */}
        <AlertTriangle
          aria-hidden="true"
          className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${styles.icon}`}
        />

        {/* Error Details */}
        <div className="flex-1">
          <AlertTitle className={styles.title}>
            {error.severity === 'critical' ? 'Critical Error' : 'Warning'}
          </AlertTitle>
          <AlertDescription>
            <p className={`text-sm sm:text-base lg:text-lg ${styles.message}`}>{error.message}</p>
            <div className="flex items-center gap-3 sm:gap-4">
              <Clock
                aria-hidden="true"
                className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 ${styles.timestamp}`}
              />
              <span className={`text-xs sm:text-sm lg:text-base ${styles.timestamp}`}>
                {error.timestamp}
              </span>
            </div>
          </AlertDescription>
        </div>

        {/* Dismiss Button */}
        <button
          className={`rounded-full p-2 sm:p-3 transition-colors hover:bg-white/20 focus:ring focus:ring-offset-1 ${styles.icon}`}
          aria-label="Dismiss alert"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
        </button>
      </div>

      {/* Decorative Left Border */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 lg:w-2 ${styles.border}`}
      />
    </Alert>
  );
}

export default ErrorAlert;
