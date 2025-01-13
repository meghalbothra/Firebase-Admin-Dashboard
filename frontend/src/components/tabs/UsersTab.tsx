import React from 'react';
import { Users, Mail, Calendar, Loader2, UserCircle } from "lucide-react";
import { User } from '../types';


// interface User {
//   uid: string;
//   email: string;
//   creation_time: number | null;
// }

interface UsersTabProps {
  users: User[];
  loading: boolean;
}

// Card Component
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg p-6 ${className || ''}`}>
    {children}
  </div>
);

// CardHeader Component
const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`border-b pb-4 mb-4 ${className || ''}`}>
    {children}
  </div>
);

// CardTitle Component
const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-gray-900">
    {children}
  </h2>
);

// CardContent Component
const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-gray-600">
    {children}
  </div>
);


export const UsersTab: React.FC<UsersTabProps> = ({ users, loading }) => {
  const formatCreationDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Card className="max-w-8xl ">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <CardTitle>Users</CardTitle>
          </div>
          <div className="text-sm text-gray-500">
            {users.length} {users.length === 1 ? 'user' : 'users'} registered
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading users...</span>
            </div>
          </div>
        ) : (
          <>
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-2">
                <Users className="w-8 h-8" />
                <span>No users found</span>
              </div>
            ) : (
              <div className="relative overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 font-medium text-gray-600">
                        <div className="flex items-center space-x-2">
                          <UserCircle className="w-4 h-4" />
                          <span>UID</span>
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
                          <Calendar className="w-4 h-4" />
                          <span>Creation Date</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr 
                        key={user.uid} 
                        className={`
                          border-b last:border-b-0 hover:bg-gray-50 transition-colors
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                        `}
                      >
                        <td className="p-4 font-medium text-gray-700">
                          <div className="truncate max-w-xs" title={user.uid}>
                            {user.uid}
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatCreationDate(user.creation_time)}</span>
                          </div>
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

export default UsersTab;
