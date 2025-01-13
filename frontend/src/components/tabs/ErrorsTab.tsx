import React, { useState, useEffect } from 'react';
import { ErrorAlert } from '../ErrorAlert';
import { SearchBar } from '../SearchBar';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface Error {
  id: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning';
}

interface ErrorsTabProps {
  onErrorCountChange: (count: number) => void;
}

export function ErrorsTab({ onErrorCountChange }: ErrorsTabProps) {
  const [errors, setErrors] = useState<Error[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const errorsCollectionRef = collection(db, 'loginErrors');
        const querySnapshot = await getDocs(errorsCollectionRef);
        
        const fetchedErrors: Error[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          message: doc.data().errorMessage || 'No message provided',
          timestamp: doc.data().timestamp?.toDate().toLocaleString() || 'Unknown',
          severity: doc.data().severity || 'warning',
        }));
        
        setErrors(fetchedErrors);
        onErrorCountChange(fetchedErrors.length);
      } catch (err) {
        console.error('Error fetching errors from Firestore:', err);
      }
    };
    
    fetchErrors();
  }, [onErrorCountChange]);

  const filteredErrors = errors.filter(error => {
    const matchesSearch = error.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || error.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const errorCounts = {
    critical: errors.filter(e => e.severity === 'critical').length,
    warning: errors.filter(e => e.severity === 'warning').length,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-6 w-6" />;
      case 'warning': return <AlertTriangle className="h-6 w-6" />;
      default: return null;
    }
  };

  const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-gray-900">
      {children}
    </h2>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white shadow-lg rounded-lg p-4">{children}</div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
          <CardTitle>Error Tracking</CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              Monitoring {errors.length} total errors across the system
            </p>
          </div>
          <div className="flex space-x-4">
            
          </div>
        </div>

        {/* Error Summary Cards */}
        <div className="grid grid-cols-2 gap-10 mt-6 ">
          {['critical', 'warning'].map((severity) => (
            <button
              key={severity}
              onClick={() => setSelectedSeverity(selectedSeverity === severity ? 'all' : severity)}
              className={`
                p-6 rounded-lg border shadow-md transition-all duration-200
                ${selectedSeverity === severity 
                  ? 'border-2 border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="flex items-center space-x-6">
                <div className={getSeverityColor(severity)}>
                  {getSeverityIcon(severity)}
                </div>
                <div className="text-left">
                  <p className="text-lg font-medium capitalize">{severity}</p>
                  <p className="text-3xl font-semibold mt-2">
                    {errorCounts[severity as keyof typeof errorCounts]}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Results Section */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-lg mx-5">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium text-gray-700">
              Showing {filteredErrors.length} {selectedSeverity !== 'all' && selectedSeverity} errors
            </h4>
            {selectedSeverity !== 'all' && (
              <button
                onClick={() => setSelectedSeverity('all')}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredErrors.length > 0 ? (
            filteredErrors.map(error => (
              <div key={error.id} className="p-4">
                <ErrorAlert error={error} />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No errors found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
}