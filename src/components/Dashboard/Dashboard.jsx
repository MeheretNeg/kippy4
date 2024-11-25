import { useContext } from 'react';
import { UserRoleContext } from '../../contexts/UserRoleContext';
import { useJobOrders } from '../../contexts/JobOrdersContext';
import { performanceMetrics, commissionData, systemMetrics } from '../../utils/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRecruiterData } from '../../contexts/RecruiterContext';
import PerformanceDial from './PerformanceDial';
import { useNavigate } from 'react-router-dom';

const MetricCard = ({ title, value, subtitle, trend }) => (
  <Card className="bg-white shadow-sm border border-gray-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      {trend && (
        <Badge
          className={cn(
            trend > 0 ? 'bg-black text-white' : 'bg-white text-black border border-gray-200'
          )}
        >
          {trend > 0 ? '+' : ''}{trend}%
        </Badge>
      )}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">
          {subtitle}
        </p>
      )}
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Candidates Placed"
          value={metrics.candidatesPlaced}
          trend={5}
        />
        <MetricCard
          title="Active Jobs"
          value={metrics.activeJobs}
          trend={3}
        />
        <MetricCard
          title="Monthly Target"
          value={`${metrics.monthlyTarget.achieved}/${metrics.monthlyTarget.target}`}
          subtitle="Placements this month"
        />
        <MetricCard
          title="Commission Earned"
          value={`Birr ${commissionData.individual.currentMonth.toLocaleString()}`}
          trend={15}
        />
      </div>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-gray-900">My Active Jobs</CardTitle>
            <Button variant="outline" size="sm">
              View All
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <JobList jobs={activeJobs.slice(0, 2)} />
        </CardContent>
      </Card>
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
  const [motivationTip] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="p-6">
          <div className="flex flex-col space-y-6 font-inter">
            {/* Welcome Message */}
            <Card className="bg-yellow-50 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Welcome, {recruiterData.recruiterName}! Let's make today impactful.
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Performance Dial */}
            <PerformanceDial
              current={recruiterData.weeklyMetrics.placements.current}
              goal={recruiterData.weeklyMetrics.placements.target}
              title="Weekly Placements"
              description="Track your progress towards this week's placement goal"
            />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              <Card 
                className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white hover:bg-gray-50"
                onClick={() => navigate('/planning')}
              >
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Jobs</h3>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{jobOrders.filter(job => job.status === 'Open').length}</p>
                      <p className="ml-2 text-sm text-gray-600">Open Positions</p>
                    </div>
                    <p className="text-sm text-gray-500">Click to view planning</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Commission Earned</h3>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{recruiterData.commissionEarned.toLocaleString()}</p>
                      <p className="ml-2 text-sm text-gray-600">Birr This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Submissions</h3>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{recruiterData.cvsSourced}</p>
                      <p className="ml-2 text-sm text-gray-600">This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recruitment Trends Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Recruitment Trends</h2>
                <select className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-600">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* KPI Progress Bars */}
              <div className="grid gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">In House Interviews</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {recruiterData.weeklyMetrics.inHouseInterviews.current}/{recruiterData.weeklyMetrics.inHouseInterviews.target}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gray-700 rounded-full transition-all duration-500"
                      style={{ width: `${(recruiterData.weeklyMetrics.inHouseInterviews.current / recruiterData.weeklyMetrics.inHouseInterviews.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Client Interviews</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {recruiterData.weeklyMetrics.clientInterviews.current}/{recruiterData.weeklyMetrics.clientInterviews.target}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gray-600 rounded-full transition-all duration-500"
                      style={{ width: `${(recruiterData.weeklyMetrics.clientInterviews.current / recruiterData.weeklyMetrics.clientInterviews.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Placements Achieved</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {recruiterData.weeklyMetrics.placements.current}/{recruiterData.weeklyMetrics.placements.target}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gray-500 rounded-full transition-all duration-500"
                      style={{ width: `${(recruiterData.weeklyMetrics.placements.current / recruiterData.weeklyMetrics.placements.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
                <h3 className="px-4 py-3 text-sm font-medium text-gray-600">Insights</h3>
                <div className="p-4 space-y-3">
                  {recruiterData.trends.screenings.percentage !== 0 && (
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${recruiterData.trends.screenings.isUp ? 'bg-green-100' : 'bg-yellow-100'} flex items-center justify-center`}>
                        <svg className={`w-5 h-5 ${recruiterData.trends.screenings.isUp ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={recruiterData.trends.screenings.isUp ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 font-medium">
                          Your screenings are {recruiterData.trends.screenings.isUp ? 'up' : 'down'} {Math.abs(recruiterData.trends.screenings.percentage)}% this week!
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {recruiterData.trends.screenings.isUp ? 'Keep up the great work' : 'Focus on increasing your screening activities'}
                        </p>
                      </div>
                    </div>
                  )}
                  {recruiterData.trends.placements.percentage !== 0 && (
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${recruiterData.trends.placements.isUp ? 'bg-green-100' : 'bg-yellow-100'} flex items-center justify-center`}>
                        <svg className={`w-5 h-5 ${recruiterData.trends.placements.isUp ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={recruiterData.trends.placements.isUp ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 font-medium">
                          Placements have {recruiterData.trends.placements.isUp ? 'increased' : 'decreased'} by {Math.abs(recruiterData.trends.placements.percentage)}% 
                          {recruiterData.trends.placements.isUp ? ' this week!' : ' over the last 2 weeks'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {recruiterData.trends.placements.isUp 
                            ? 'Excellent progress on converting interviews to placements'
                            : 'Focus on converting more interviews to placements'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Daily Motivation Tip */}
            <Card className="bg-yellow-50 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-3xl font-quotes text-gray-800 leading-relaxed px-8 tracking-wide">{motivationTip}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {userRole === 'manager' && <ManagerDashboard />}
        {userRole === 'recruiter' && <RecruiterDashboard />}
        {userRole === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;