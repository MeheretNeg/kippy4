import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../ui/drawer';
import { Users, Briefcase, CheckCircle, Plus } from 'lucide-react';
import AddEmployeeForm from './AddEmployeeForm';
import LeaveRequestDialog from './shared/LeaveRequestDialog';
import LeaveRequestsTable from './shared/LeaveRequestsTable';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

const ManagerEmployees = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      position: 'Senior Recruiter',
      department: 'Recruitment',
      email: 'john.doe@company.com',
      joinDate: '2023-01-15',
      activeJobs: 5,
      placements: 12,
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Recruitment Specialist",
      department: "Healthcare",
      email: "jane.smith@example.com",
      phone: "+1234567891",
      joinDate: "2023-03-20",
      activeJobs: 4,
      placements: 8
    }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const employee = { id: '123', name: 'John Doe' }; // Replace with actual employee data

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
    setIsDrawerOpen(false);
  };

  const handleRequestSubmit = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalEmployees: employees.length,
    totalActiveJobs: employees.reduce((sum, emp) => sum + emp.activeJobs, 0),
    totalPlacements: employees.reduce((sum, emp) => sum + emp.placements, 0),
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-screen">
            <DrawerHeader>
              <DrawerTitle>Add New Employee</DrawerTitle>
            </DrawerHeader>
            <AddEmployeeForm
              onSubmit={handleAddEmployee}
              onCancel={() => setIsDrawerOpen(false)}
            />
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActiveJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlacements}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <div className="flex items-center py-4">
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <List
            height={400}
            itemCount={filteredEmployees.length}
            itemSize={35}
            width={'100%'}
          >
            {({ index, style }) => (
              <div style={style}>
                <TableRow>
                  <TableCell className="font-medium">
                    <button
                      onClick={() => navigate(`/employees/${filteredEmployees[index].id}`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                    >
                      {filteredEmployees[index].name}
                    </button>
                  </TableCell>
                  <TableCell>{filteredEmployees[index].position}</TableCell>
                  <TableCell>{filteredEmployees[index].department}</TableCell>
                  <TableCell>{filteredEmployees[index].email}</TableCell>
                  <TableCell>{filteredEmployees[index].joinDate}</TableCell>
                  <TableCell>{filteredEmployees[index].activeJobs}</TableCell>
                  <TableCell>{filteredEmployees[index].placements}</TableCell>
                </TableRow>
              </div>
            )}
          </List>
        </CardContent>
      </Card>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <LeaveRequestDialog 
            employee={employee} 
            onRequestSubmit={handleRequestSubmit} 
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Leave Requests</h3>
          <LeaveRequestsTable 
            employeeId={employee.id} 
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerEmployees;
