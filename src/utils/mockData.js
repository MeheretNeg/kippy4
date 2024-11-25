export const performanceMetrics = {
  team: {
    totalPlacements: 45,
    activeJobs: 120,
    averageSuccessRate: '68%',
    monthlyTarget: {
      target: 60,
      achieved: 45,
    },
  },
  recruiter: {
    candidatesPlaced: 12,
    activeJobs: 25,
    monthlyTarget: {
      target: 15,
      achieved: 12,
    },
  },
};

export const mockRecruiters = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Wilson' },
];

export const mockClients = [
  { id: 1, name: 'Tech Corp' },
  { id: 2, name: 'Innovate Solutions' },
  { id: 3, name: 'Digital Systems' },
  { id: 4, name: 'Future Technologies' },
];

export const jobColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-red-500',
];

export const jobOrders = [
  {
    id: 1,
    clientName: 'Tech Corp',
    jobTitle: 'Senior Software Engineer',
    location: 'New York, NY',
    salary: 150000,
    receivedDate: '2024-01-15',
    dueDate: '2024-02-15',
    recruiter: 'John Doe',
    status: 'Open',
    priority: 'High',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    clientName: 'Innovate Solutions',
    jobTitle: 'Product Manager',
    location: 'San Francisco, CA',
    salary: 140000,
    receivedDate: '2024-01-20',
    dueDate: '2024-02-20',
    recruiter: 'Jane Smith',
    status: 'Open',
    priority: 'Medium',
    color: 'bg-purple-500'
  },
  {
    id: 3,
    clientName: 'Digital Systems',
    jobTitle: 'DevOps Engineer',
    location: 'Austin, TX',
    salary: 130000,
    receivedDate: '2024-01-25',
    dueDate: '2024-02-25',
    recruiter: 'Mike Johnson',
    status: 'Open',
    priority: 'Low',
    color: 'bg-green-500'
  },
  {
    id: 4,
    clientName: 'Future Technologies',
    jobTitle: 'UI/UX Designer',
    location: 'Seattle, WA',
    salary: 120000,
    receivedDate: '2024-01-30',
    dueDate: '2024-03-01',
    recruiter: 'Sarah Wilson',
    status: 'Open',
    priority: 'Medium',
    color: 'bg-yellow-500'
  }
];

export const commissionData = {
  individual: {
    currentMonth: 12500,
    ytd: 85000,
    projected: 150000,
  },
  team: {
    currentMonth: 45000,
    ytd: 320000,
    projected: 550000,
  },
};

export const systemMetrics = {
  activeUsers: 45,
  totalJobs: 1250,
  systemHealth: {
    status: 'Healthy',
    uptime: '99.9%',
    lastBackup: '2024-01-21 03:00 AM',
  },
  revenueYTD: 1250000,
};
