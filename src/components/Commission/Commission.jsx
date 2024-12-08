import { useState, useEffect } from 'react';
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
import { ChevronDown, Calendar, Filter, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const QuickStatsCard = ({ title, value, subtitle, trend }) => (
  <Card className="bg-white shadow-sm border border-gray-200">
    <CardContent className="p-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {trend && (
            <div className="flex items-center">
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                trend >= 0 
                  ? "bg-green-50 text-green-700" 
                  : "bg-red-50 text-red-700"
              )}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {subtitle && (
            <span className="text-sm text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const FilterSection = ({ filters, onFilterChange, onClearFilters, jobTitles, clientNames }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      <Button variant="outline" size="sm" onClick={onClearFilters}>
        <X className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Select value={filters.period} onValueChange={(value) => onFilterChange('period', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="week">Last Week</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
          <SelectItem value="quarter">Last Quarter</SelectItem>
          <SelectItem value="year">Last Year</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.jobTitle} onValueChange={(value) => onFilterChange('jobTitle', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Job Title" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Jobs</SelectItem>
          {jobTitles.map(title => (
            <SelectItem key={title} value={title}>{title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.clientName} onValueChange={(value) => onFilterChange('clientName', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Client Name" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          {clientNames.map(client => (
            <SelectItem key={client} value={client}>{client}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const ChartSection = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Commission Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="potential" 
                  fill="#94A3B8" 
                  name="Potential Commission"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="earned" 
                  fill="#000000" 
                  name="Earned Commission"
                  radius={[4, 4, 0, 0]}
                />
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
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                >
                  {data.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
  const navigate = useNavigate();
  const progress = (data.earnedCommission / data.potentialCommission) * 100;
  const tier = progress >= 75 ? 'Platinum' : progress >= 50 ? 'Gold' : progress >= 25 ? 'Silver' : 'Bronze';

  const handlePlanWeek = () => {
    navigate('/planning'); // Navigate to calendar/planner page
  };

  const handleReviewJobs = () => {
    navigate('/job-orders'); // Navigate to jobs page
  };

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
          <Button 
            variant="outline" 
            onClick={handlePlanWeek}
            className="bg-black text-white hover:bg-accent hover:text-black transition-colors border-black hover:border-accent"
          >
            Plan My Week
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReviewJobs}
            className="bg-black text-white hover:bg-accent hover:text-black transition-colors border-black hover:border-accent"
          >
            Review Job Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Commission = () => {
  const { commissionData } = useCommission();
  const [filters, setFilters] = useState({
    period: 'all',
    status: 'all',
    jobTitle: 'all',
    clientName: 'all'
  });
  const [filteredData, setFilteredData] = useState(commissionData);

  useEffect(() => {
    applyFilters();
  }, [filters, commissionData]);

  const calculateTotals = (jobs) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return jobs.reduce((acc, job) => {
      const jobDate = new Date(job.placementDate);
      const isThisMonth = jobDate.getMonth() === thisMonth && jobDate.getFullYear() === thisYear;
      
      return {
        totalEarned: acc.totalEarned + (Number(job.earnedCommission) || 0),
        totalPotential: acc.totalPotential + (Number(job.potentialCommission) || 0),
        openJobs: acc.openJobs + (job.status.toLowerCase() === 'open' ? 1 : 0),
        thisMonthEarned: acc.thisMonthEarned + (isThisMonth ? (Number(job.earnedCommission) || 0) : 0)
      };
    }, {
      totalEarned: 0,
      totalPotential: 0,
      openJobs: 0,
      thisMonthEarned: 0
    });
  };

  const applyFilters = () => {
    let filtered = commissionData.jobOrders;

    if (filters.period !== 'all') {
      const now = new Date();
      filtered = filtered.filter(job => {
        const jobDate = new Date(job.placementDate);
        switch (filters.period) {
          case 'week':
            return jobDate >= new Date(now.setDate(now.getDate() - 7));
          case 'month':
            return jobDate >= new Date(now.setMonth(now.getMonth() - 1));
          case 'quarter':
            return jobDate >= new Date(now.setMonth(now.getMonth() - 3));
          case 'year':
            return jobDate >= new Date(now.setFullYear(now.getFullYear() - 1));
          default:
            return true;
        }
      });
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(job => job.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.jobTitle !== 'all') {
      filtered = filtered.filter(job => job.jobTitle === filters.jobTitle);
    }

    if (filters.clientName !== 'all') {
      filtered = filtered.filter(job => job.clientName === filters.clientName);
    }

    const totals = calculateTotals(filtered);
    const monthlyData = calculateMonthlyData(filtered);
    const pieData = calculatePieData(filtered);

    setFilteredData({
      jobOrders: filtered,
      monthlyData,
      pieData,
      ...totals
    });
  };

  const calculateMonthlyData = (jobs) => {
    const monthlyMap = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with zero values
    months.forEach(month => {
      monthlyMap.set(month, { month, potential: 0, earned: 0 });
    });

    // Aggregate job data
    jobs.forEach(job => {
      if (job.placementDate) {
        const date = new Date(job.placementDate);
        const month = months[date.getMonth()];
        const existing = monthlyMap.get(month);
        
        if (existing) {
          existing.potential += Number(job.potentialCommission) || 0;
          existing.earned += Number(job.earnedCommission) || 0;
          monthlyMap.set(month, existing);
        }
      }
    });

    // Convert to array and sort by month order
    const currentMonth = new Date().getMonth();
    return Array.from(monthlyMap.values())
      .sort((a, b) => {
        const aIndex = months.indexOf(a.month);
        const bIndex = months.indexOf(b.month);
        // Reorder months to start from current month
        const adjustedAIndex = (aIndex - currentMonth + 12) % 12;
        const adjustedBIndex = (bIndex - currentMonth + 12) % 12;
        return adjustedAIndex - adjustedBIndex;
      });
  };

  const calculatePieData = (jobs) => {
    const clientMap = new Map();
    jobs.forEach(job => {
      const existing = clientMap.get(job.clientName) || { name: job.clientName, value: 0 };
      existing.value += Number(job.earnedCommission) || 0;
      clientMap.set(job.clientName, existing);
    });
    return Array.from(clientMap.values());
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      period: 'all',
      status: 'all',
      jobTitle: 'all',
      clientName: 'all'
    });
  };

  // Get unique job titles and client names for filter options
  const jobTitles = [...new Set(commissionData.jobOrders.map(job => job.jobTitle))];
  const clientNames = [...new Set(commissionData.jobOrders.map(job => job.clientName))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatsCard
            title="Potential Commission"
            value={formatCurrency(filteredData.totalPotential)}
            trend={5}
          />
          <QuickStatsCard
            title="Earned Commission"
            value={formatCurrency(filteredData.thisMonthEarned)}
            subtitle="This Month"
            trend={8}
          />
          <QuickStatsCard
            title="Open Jobs"
            value={filteredData.openJobs}
            trend={-2}
          />
          <QuickStatsCard
            title="Total Commission"
            value={formatCurrency(filteredData.totalEarned)}
            subtitle="All Time"
            trend={10}
          />
        </div>

        <FilterSection 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          jobTitles={jobTitles}
          clientNames={clientNames}
        />

        <ChartSection data={{
          monthlyData: filteredData.monthlyData,
          pieData: filteredData.pieData
        }} />
        
        <CommissionTable data={filteredData} />
        
        <MotivationalSection data={{
          earnedCommission: filteredData.totalEarned,
          potentialCommission: filteredData.totalPotential
        }} />
      </div>
    </div>
  );
};

export default Commission;
