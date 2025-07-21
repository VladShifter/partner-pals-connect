import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Development mode navigation helper
const DevModeNavigation = () => {
  const routes = [
    { path: '/', label: 'Home' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/vendor/dashboard', label: 'Vendor Dashboard' },
    { path: '/partner/dashboard', label: 'Partner Dashboard' },
    { path: '/admin/dashboard', label: 'Admin Dashboard' },
    { path: '/admin/overview', label: 'Admin Overview' },
    { path: '/admin/vendors', label: 'Admin Vendors' },
    { path: '/admin/partners', label: 'Admin Partners' },
    { path: '/admin/applications', label: 'Admin Applications' },
    { path: '/admin/tags', label: 'Admin Tags' },
    { path: '/chat/demo', label: 'Chat Demo' },
    { path: '/login', label: 'Login' },
    { path: '/signup', label: 'Signup' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <details className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs">
        <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
          🚀 Dev Navigation
        </summary>
        <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="block text-xs text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded"
            >
              {route.label}
            </Link>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">Development Mode Active</p>
        </div>
      </details>
    </div>
  );
};

export default DevModeNavigation;