import React from 'react';
import { useUserRole } from '../../contexts/UserRoleContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const { isAdmin } = useUserRole();

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">You do not have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage users and view system logs</p>
      </div>
      
      <UserManagement />
    </div>
  );
};

export default AdminDashboard;