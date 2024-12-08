import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserRoleProvider, useUserRole } from './contexts/UserRoleContext';
import { WeeklyActivityProvider } from './contexts/WeeklyActivityContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { CommissionProvider } from './contexts/CommissionContext';
import { RecruiterProvider } from './contexts/RecruiterContext';
import { JobOrdersProvider } from './contexts/JobOrdersContext';
import Navigation from './components/Navigation';
import ManagerNavigation from './components/Manager/ManagerNavigation';
import Dashboard from './components/Dashboard/Dashboard';
import WeeklyPlanning from './components/Planning/WeeklyPlanning';
import WeeklyActivity from './components/WeeklyActivity/WeeklyActivity';
import JobOrders from './components/JobOrders/JobOrders';
import Commission from './components/Commission/Commission';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManagerDashboard from './components/Manager/Dashboard/ManagerDashboard';
import ManagerJobs from './components/Manager/Jobs/ManagerJobs';
import ManagerKPIs from './components/Manager/KPIs/ManagerKPIs';
import ManagerProjects from './components/Manager/Projects/ManagerProjects';
import ManagerReports from './components/Manager/Reports/ManagerReports';
import ManagerEmployees from './components/Manager/Employees/ManagerEmployees';
import EditEmployeeProfile from './components/Manager/Employees/EditEmployeeProfile';
import { Toaster } from "./components/ui/toaster";

function AppContent() {
  const { userRole } = useUserRole();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {userRole === 'manager' ? <ManagerNavigation /> : <Navigation />}
        <div className="flex-1 overflow-auto">
          <Toaster />
          <main className="pt-16">
            <Routes>
              {/* Recruiter and Admin Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/planning" element={<WeeklyPlanning />} />
              <Route path="/activity" element={<WeeklyActivity />} />
              <Route path="/job-orders" element={<JobOrders />} />
              <Route path="/commission" element={<Commission />} />
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Manager Routes */}
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/jobs" element={<ManagerJobs />} />
              <Route path="/manager/employees" element={<ManagerEmployees />} />
              <Route path="/employees/:id" element={<EditEmployeeProfile />} />
              <Route path="/manager/kpis" element={<ManagerKPIs />} />
              <Route path="/manager/projects" element={<ManagerProjects />} />
              <Route path="/manager/reports" element={<ManagerReports />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserRoleProvider>
        <JobOrdersProvider>
          <WeeklyActivityProvider>
            <ScheduleProvider>
              <CommissionProvider>
                <RecruiterProvider>
                  <AppContent />
                </RecruiterProvider>
              </CommissionProvider>
            </ScheduleProvider>
          </WeeklyActivityProvider>
        </JobOrdersProvider>
      </UserRoleProvider>
    </Router>
  );
}

export default App;
