import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { WeeklyActivityProvider } from './contexts/WeeklyActivityContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { CommissionProvider } from './contexts/CommissionContext';
import { RecruiterProvider } from './contexts/RecruiterContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import WeeklyPlanning from './components/Planning/WeeklyPlanning';
import WeeklyActivity from './components/WeeklyActivity/WeeklyActivity';
import JobOrders from './components/JobOrders/JobOrders';
import Commission from './components/Commission/Commission';
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <UserRoleProvider>
      <WeeklyActivityProvider>
        <ScheduleProvider>
          <CommissionProvider>
            <RecruiterProvider>
              <Router>
                <div className="min-h-screen bg-background text-foreground">
                  <div className="flex h-screen">
                    <Navigation />
                    <div className="flex-1 overflow-auto">
                      <Toaster />
                      <main className="pt-16">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/planning" element={<WeeklyPlanning />} />
                          <Route path="/activity" element={<WeeklyActivity />} />
                          <Route path="/job-orders" element={<JobOrders />} />
                          <Route path="/commission" element={<Commission />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </div>
              </Router>
            </RecruiterProvider>
          </CommissionProvider>
        </ScheduleProvider>
      </WeeklyActivityProvider>
    </UserRoleProvider>
  );
}

export default App;
