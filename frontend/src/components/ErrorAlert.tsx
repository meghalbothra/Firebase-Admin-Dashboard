import React from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';

// Alert component (UI component)
export const Alert = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return (
    <div className={`relative rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
};

export const AlertDescription = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
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
      container: 'border-red-200 bg-red-50',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-800',
      timestamp: 'text-red-600',
      border: 'bg-red-600',
    },
    warning: {
      container: 'border-yellow-200 bg-yellow-50',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
      timestamp: 'text-yellow-600',
      border: 'bg-yellow-600',
    },
  };

  const styles = severityStyles[error.severity];

  return (
    <div className="relative mb-4">
      <Alert className={`flex flex-col sm:flex-row items-start gap-4 pr-12 ${styles.container}`}>
        {/* Severity Icon */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>

        {/* Error Details */}
        <div className="flex-1 space-y-1">
          <AlertTitle className={styles.title}>
            {error.severity === 'critical' ? 'Critical Error' : 'Warning'}
          </AlertTitle>
          <AlertDescription className={styles.message}>
            {error.message}
          </AlertDescription>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            <span className={styles.timestamp}>{error.timestamp}</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          className={`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${styles.icon}`}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Decorative Left Border */}
        <div className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${styles.border}`} />
      </Alert>
    </div>
  );
}

export default ErrorAlert;