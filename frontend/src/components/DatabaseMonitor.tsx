import React, { useState, useEffect } from 'react';
import { fetchDataFromFirestore } from '../firebase/firestore';
import { Database, Mail, UserCircle, Calendar, Loader2 } from "lucide-react";

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg p-6 ${className}`}>
    {children}
  </div>
);


const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b pb-4 mb-4">
    {children}
  </div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-gray-900">
    {children}
  </h2>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-gray-600">
    {children}
  </div>
);

const DatabaseMonitor: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = fetchDataFromFirestore('users', (fetchedData) => {
      console.log('Fetched Data:', fetchedData);
      setData(fetchedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'null';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <Card className="max-w-8xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-600" />
            <CardTitle>Database Monitor</CardTitle>
          </div>
          <div className="text-sm text-gray-500">
            {data.length} {data.length === 1 ? 'user' : 'users'} found
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading data...</span>
            </div>
          </div>
        ) : (
          <>
            {data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-2">
                <Database className="w-8 h-8" />
                <span>No data available.</span>
              </div>
            ) : (
              <div className="relative overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 font-medium text-gray-600">
                        <div className="flex items-center space-x-2">
                          <UserCircle className="w-4 h-4" />
                          <span>ID</span>
                        </div>
                      </th>
                      <th className="p-4 font-medium text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </div>
                      </th>
                      <th className="p-4 font-medium text-gray-600">
                        <div className="flex items-center space-x-2">
                          <UserCircle className="w-4 h-4" />
                          <span>Role</span>
                        </div>
                      </th>
                      <th className="p-4 font-medium text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created At</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`
                          border-b last:border-b-0 hover:bg-gray-50 transition-colors
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                        `}
                      >
                        <td className="p-4 text-gray-700 font-medium">
                          {item.id || 'null'}
                        </td>
                        <td className="p-4 text-gray-600">
                          {item.data.email || 'null'}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                            ${item.data.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                             item.data.role === 'user' ? 'bg-green-100 text-green-700' :
                             'bg-gray-100 text-gray-700'}`}>
                            {item.data.role || 'null'}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatTimestamp(item.data.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseMonitor;
