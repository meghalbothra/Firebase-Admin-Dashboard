import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            {children}
            <Link to="/settings">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Settings className="h-5 w-5" />
            </button>
            </Link>
           
            {/* Profile button links to Profile page */}
            <Link to="/profile">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <User className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
