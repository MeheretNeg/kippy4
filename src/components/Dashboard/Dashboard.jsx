import { useContext } from 'react';
import { UserRoleContext } from '../../contexts/UserRoleContext';
import { useJobOrders } from '../../contexts/JobOrdersContext';
import { performanceMetrics, commissionData, systemMetrics } from '../../utils/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { 
  ChevronDown, 
  ChevronRight,
  Target, 
  Users, 
  Clock, 
  Award,
  Briefcase,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRecruiterData } from '../../contexts/RecruiterContext';
import PerformanceDial from './PerformanceDial';
import { useNavigate } from 'react-router-dom';
import KPICard from './KPICard';
import PerformanceDashboard from './PerformanceDashboard';

const MetricCard = ({ title, value, subtitle, trend }) => (
  <Card className="bg-white shadow-sm border border-gray-200">
    <CardContent className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {trend && (
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-medium",
              trend >= 0 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            )}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        
        {/* Value */}
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {subtitle && (
            <span className="text-sm text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const JobList = ({ jobs }) => (
  <div className="space-y-4">
    {jobs.map((job) => (
      <Card key={job.id} className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg text-gray-900">{job.jobTitle}</CardTitle>
              <CardDescription className="text-gray-500">{job.clientName}</CardDescription>
            </div>
            <Badge
              className={cn(
                job.status === 'Open'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-200'
              )}
            >
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{job.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium text-gray-900">{job.salary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="font-medium text-gray-900">{job.dueDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <Badge
                className={cn(
                  job.priority === 'High'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-200'
                )}
              >
                {job.priority}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ManagerDashboard = () => {
  const metrics = performanceMetrics.team;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Placements"
          value={metrics.totalPlacements}
          trend={8}
        />
        <MetricCard
          title="Active Jobs"
          value={metrics.activeJobs}
          trend={12}
        />
        <MetricCard
          title="Success Rate"
          value={metrics.averageSuccessRate}
          trend={-2}
        />
        <MetricCard
          title="Monthly Target"
          value={`${metrics.monthlyTarget.achieved}/${metrics.monthlyTarget.target}`}
          subtitle="Placements this month"
        />
      </div>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-gray-900">Team Performance</CardTitle>
            <Button variant="outline" size="sm">
              View Details
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Team performance metrics will go here */}
        </CardContent>
      </Card>
    </div>
  );
};

const RecruiterDashboard = () => {
  const { jobOrders } = useJobOrders();
  const metrics = performanceMetrics.recruiter;
  const activeJobs = jobOrders.filter(job => job.status === 'Open');
  const { recruiterData } = useRecruiterData();
  
  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Monthly Placements"
          current={recruiterData.placementsThisMonth}
          target={10}
          previousPeriod={8}
          icon={Target}
          trend={15}
        />
        <KPICard
          title="Weekly Submissions"
          current={recruiterData.cvsSourced}
          target={30}
          previousPeriod={45}
          icon={Users}
          trend={-10}
        />
        <KPICard
          title="In-House Interviews"
          current={recruiterData.weeklyMetrics.inHouseInterviews.current}
          target={recruiterData.weeklyMetrics.inHouseInterviews.target}
          previousPeriod={15}
          icon={Briefcase}
          trend={20}
        />
        <KPICard
          title="Client Interviews"
          current={recruiterData.weeklyMetrics.clientInterviews.current}
          target={recruiterData.weeklyMetrics.clientInterviews.target}
          previousPeriod={12}
          icon={Clock}
          trend={5}
        />
      </div>
    </div>
  );
};

const AdminDashboard = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      <Button variant="outline">
        System Settings
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard 
        title="Active Users"
        value={systemMetrics.activeUsers}
        subtitle="Currently in system"
        trend={5}
      />
      <MetricCard 
        title="Total Jobs"
        value={systemMetrics.totalJobs}
        subtitle="All time"
        trend={18}
      />
      <MetricCard 
        title="System Status"
        value={systemMetrics.systemHealth.status}
        subtitle={`Uptime: ${systemMetrics.systemHealth.uptime}`}
      />
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">System Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-600">Last Backup</span>
            <span className="text-sm font-medium text-gray-900">{systemMetrics.systemHealth.lastBackup}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-600">Total Revenue YTD</span>
            <span className="text-sm font-medium text-gray-900">Birr {systemMetrics.revenueYTD.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">Backup System</Button>
            <Button variant="outline">User Management</Button>
            <Button variant="outline">View Logs</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const motivationalQuotes = [
  "Success is not the key to happiness. Happiness is the key to success.",
  "Opportunities don't happen. You create them.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Your value will be not what you know; it will be what you share.",
  "Every great achievement was once considered impossible.",
  "The best way to predict the future is to create it.",
  "The difference between ordinary and extraordinary is that little extra.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "It's not the number of hours you put in, but what you put into those hours that counts."
];

const Dashboard = () => {
  const { userRole } = useContext(UserRoleContext);
  const { recruiterData } = useRecruiterData();
  const { jobOrders } = useJobOrders();
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [motivationTip] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  // Add loading check
  if (!recruiterData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  const activeJobs = jobOrders?.filter(job => job.status === 'Open') || [];
  const urgentJobs = activeJobs.filter(job => job.priority === 'High');
  const upcomingInterviews = recruiterData.upcomingInterviews || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {recruiterData.recruiterName}</h1>
              <p className="text-gray-600 mt-1">Here's your recruitment dashboard for today</p>
            </div>
            <Button onClick={() => navigate('/job-orders')} className="bg-black text-white hover:bg-yellow-500 hover:text-black transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              New Job Order
            </Button>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Performance Overview */}
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold">Performance Overview</CardTitle>
                  <select 
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-600"
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                  >
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                    <option value="quarterly">This Quarter</option>
                  </select>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Placements</span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold">{recruiterData.placementsThisMonth}</span>
                        <span className="text-sm text-green-600">+{recruiterData.trends.placements.percentage}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Submissions</span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold">{recruiterData.cvsSourced}</span>
                        <span className="text-sm text-green-600">+{recruiterData.trends.screenings.percentage}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Commission</span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold">Birr {recruiterData.commissionEarned.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {recruiterData.weeklyMetrics.placements.current}/{recruiterData.weeklyMetrics.placements.target}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black rounded-full transition-all duration-500"
                          style={{ width: `${(recruiterData.weeklyMetrics.placements.current / recruiterData.weeklyMetrics.placements.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commission Overview Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-600">Monthly Commission</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          +12%
                        </span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gray-900">$4,250</span>
                        <span className="text-sm text-gray-500">this month</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-gray-900">75%</span>
                        </div>
                        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-black rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-600">Quarterly Bonus</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                          On Track
                        </span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gray-900">$12,800</span>
                        <span className="text-sm text-gray-500">projected</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Target Progress</span>
                          <span className="font-medium text-gray-900">60%</span>
                        </div>
                        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-600">Annual Target</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700">
                          $85,000
                        </span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gray-900">$45,600</span>
                        <span className="text-sm text-gray-500">earned YTD</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Year Progress</span>
                          <span className="font-medium text-gray-900">54%</span>
                        </div>
                        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-black rounded-full" style={{ width: '54%' }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Dashboard Section */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                  <CardDescription>Track your KPIs against industry standard targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceDashboard
                    weeklyMetrics={{
                      cvsSourced: recruiterData.weeklyMetrics.cvsSourced || 0,
                      screeningsConducted: recruiterData.weeklyMetrics.screeningsConducted || 0,
                      submissionsToClients: recruiterData.weeklyMetrics.submissionsToClients || 0,
                      inHouseInterviews: recruiterData.weeklyMetrics.inHouseInterviews.current || 0,
                      clientInterviews: recruiterData.weeklyMetrics.clientInterviews.current || 0,
                      placementsMade: recruiterData.weeklyMetrics.placementsMade || 0,
                      timeToFill: recruiterData.weeklyMetrics.timeToFill || 0,
                    }}
                    selectedWeek={selectedTimeframe}
                  />
                </CardContent>
              </Card>

              {/* Active Jobs Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xl font-semibold">Active Jobs ({activeJobs.length})</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate('/job-orders')}>
                    View All
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900">{job.jobTitle}</h3>
                          <p className="text-sm text-gray-600">{job.clientName}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Birr {job.salary.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{job.location}</p>
                          </div>
                          <Badge className={cn(
                            job.priority === 'High'
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-800'
                          )}>
                            {job.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Secondary Content */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium">Urgent Jobs</span>
                    </div>
                    <span className="text-2xl font-bold">{urgentJobs.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">Upcoming Interviews</span>
                    </div>
                    <span className="text-2xl font-bold">{upcomingInterviews.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Success Rate</span>
                    </div>
                    <span className="text-2xl font-bold">{recruiterData.successRate}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Interviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Upcoming Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingInterviews.slice(0, 3).map((interview, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{interview.candidateName}</p>
                          <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                          <p className="text-xs text-gray-500 mt-1">{interview.datetime}</p>
                        </div>
                        <Badge className={interview.type === 'Client' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}>
                          {interview.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Motivation */}
              <Card className="bg-yellow-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900 leading-relaxed">{motivationTip}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;