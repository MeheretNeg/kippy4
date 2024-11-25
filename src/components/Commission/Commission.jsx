import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';
import { useCommission } from '../../contexts/CommissionContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ChevronDown, Calendar, Filter, X } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const QuickStatsCard = ({ title, value, subtitle, trend }) => (
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
      <div className="text-2xl font-bold text-gray-900">
        {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </CardContent>
  </Card>
);

const FilterSection = ({ onFilterChange }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      <Button variant="outline" size="sm">
        <X className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="quarter">Quarter</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Job Title" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Jobs</SelectItem>
          {/* Add job titles dynamically */}
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Client Name" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          {/* Add clients dynamically */}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const ChartSection = ({ data }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Commission Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="potential" fill="#94A3B8" name="Potential" />
              <Bar dataKey="earned" fill="#000000" name="Earned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Commission by Client</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
);

const CommissionTable = ({ data }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Job Title</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Client Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Potential Commission</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Earned Commission</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Placement Date</th>
          </tr>
        </thead>
        <tbody>
          {data.jobOrders.map((job) => (
            <tr key={job.id} className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-900">{job.jobTitle}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{job.clientName}</td>
              <td className="px-4 py-3 text-sm text-gray-900">${job.potentialCommission.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm text-gray-900">${job.earnedCommission.toLocaleString()}</td>
              <td className="px-4 py-3">
                <Badge
                  className={cn(
                    job.status === 'Closed'
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-gray-200'
                  )}
                >
                  {job.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{job.placementDate || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MotivationalSection = ({ data }) => {
  const progress = (data.earnedCommission / data.potentialCommission) * 100;
  const tier = progress >= 75 ? 'Platinum' : progress >= 50 ? 'Gold' : progress >= 25 ? 'Silver' : 'Bronze';

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Current Tier: {tier}</span>
            <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex justify-center space-x-4">
          <Button variant="outline">
            Plan My Week
          </Button>
          <Button variant="outline">
            Review Job Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Commission = () => {
  const { commissionData } = useCommission();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Commission Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatsCard
            title="Potential Commission"
            value={commissionData.potentialCommission}
            trend={10}
          />
          <QuickStatsCard
            title="Earned Commission"
            value={commissionData.earnedCommission}
            trend={5}
          />
          <QuickStatsCard
            title="Earnings Progress"
            value={`${Math.round((commissionData.earnedCommission / commissionData.potentialCommission) * 100)}%`}
            subtitle="Of potential commission"
          />
          <QuickStatsCard
            title="Top Placement"
            value={`$${commissionData.topPlacement.commission.toLocaleString()}`}
            subtitle={commissionData.topPlacement.jobTitle}
          />
        </div>

        <FilterSection />
        
        <ChartSection data={commissionData} />
        
        <CommissionTable data={commissionData} />
        
        <MotivationalSection data={commissionData} />
      </div>
    </div>
  );
};

export default Commission;
