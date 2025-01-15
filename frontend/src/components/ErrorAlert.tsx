import React from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';

// Alert component (UI component)
export const Alert = ({ className, children }: { className: string, children: React.ReactNode }) => {
  return (
    <div className={`rounded-lg p-2 sm:p-4 ${className}`}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ className, children }: { className: string, children: React.ReactNode }) => {
  return <h3 className={`text-xs sm:text-sm font-semibold leading-none ${className}`}>{children}</h3>;
};

export const AlertDescription = ({ className, children }: { className: string, children: React.ReactNode }) => {
  return <div className={`space-y-1 sm:space-y-2 ${className}`}>{children}</div>;
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
      container: "border-red-200 bg-red-50 shadow-sm",
      icon: "text-red-600",
      title: "text-red-900",
      message: "text-red-800",
      timestamp: "text-red-600"
    },
    warning: {
      container: "border-yellow-200 bg-yellow-50 shadow-sm",
      icon: "text-yellow-600",
      title: "text-yellow-900",
      message: "text-yellow-800",
      timestamp: "text-yellow-600"
    }
  };

  const styles = severityStyles[error.severity];

  return (
    <Alert className={`relative overflow-hidden ${styles.container}`}>
      <div className="flex items-start gap-2 sm:gap-4">
        <AlertTriangle className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
        
        <div className="flex-1 space-y-1 sm:space-y-1.5">
          <AlertTitle className={`text-xs sm:text-sm font-semibold leading-none ${styles.title}`}>
            {error.severity === 'critical' ? 'Critical Error' : 'Warning'}
          </AlertTitle>
          
          <AlertDescription className="space-y-1 sm:space-y-2">
            <p className={`text-xs sm:text-sm ${styles.message}`}>
              {error.message}
            </p>
            
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Clock className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${styles.timestamp}`} />
              <span className={`text-xs ${styles.timestamp}`}>
                {error.timestamp}
              </span>
            </div>
          </AlertDescription>
        </div>

        <button
          className={`rounded-full p-0.5 sm:p-1 transition-colors hover:bg-white/20 ${styles.icon}`}
          aria-label="Dismiss"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>

      {/* Decorative side border */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 ${
          error.severity === 'critical' ? 'bg-red-600' : 'bg-yellow-600'
        }`}
      />
    </Alert>
  );
}

export default ErrorAlert;