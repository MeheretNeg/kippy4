import React from 'react';
import { useWeeklyActivity } from '../../contexts/WeeklyActivityContext';
import { useJobOrders } from '../../contexts/JobOrdersContext';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval } from 'date-fns';
import { useToast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";

// UI Components
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Icons
import { Plus, ChevronLeft, ChevronRight, Target, Users, CheckCircle2, ChevronDown, PenSquare } from 'lucide-react';

export default function WeeklyActivity() {
  const { activities, recruiters, addActivity, updateActivity, deleteActivity } = useWeeklyActivity();
  const { jobOrders } = useJobOrders();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingActivity, setEditingActivity] = React.useState(null);
  const [selectedJob, setSelectedJob] = React.useState(null);
  const [formData, setFormData] = React.useState({
    cvsSourced: 0,
    screeningsConducted: 0,
    submissionsToClients: 0,
    inHouseInterviews: 0,
    clientInterviews: 0,
    placementsMade: 0,
    timeToFill: 0,
    notes: '',
  });

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const handlePreviousWeek = () => {
    setSelectedDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addWeeks(prev, 1));
  };

  const handleDelete = (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity entry?')) {
      deleteActivity(activityId);
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setSelectedJob(jobOrders.find(j => j.id === activity.jobId));
    setFormData({
      cvsSourced: activity.cvsSourced || 0,
      screeningsConducted: activity.screeningsConducted || 0,
      submissionsToClients: activity.submissionsToClients || 0,
      inHouseInterviews: activity.inHouseInterviews || 0,
      clientInterviews: activity.clientInterviews || 0,
      placementsMade: activity.placementsMade || 0,
      timeToFill: activity.timeToFill || 0,
      notes: activity.notes || '',
    });
    setIsModalOpen(true);
  };

  const getJobTitle = (jobId) => {
    const job = jobOrders.find(j => j.id === jobId);
    return job ? `${job.clientName} - ${job.jobTitle}` : 'N/A';
  };

  const handleJobCardClick = (job) => {
    const existingActivity = activities.find(activity => 
      activity.jobId === job.id &&
      isWithinInterval(new Date(activity.timestamp), { start: weekStart, end: weekEnd })
    );

    setSelectedJob(job);
    if (existingActivity) {
      setFormData({
        cvsSourced: existingActivity.cvsSourced || 0,
        screeningsConducted: existingActivity.screeningsConducted || 0,
        submissionsToClients: existingActivity.submissionsToClients || 0,
        inHouseInterviews: existingActivity.inHouseInterviews || 0,
        clientInterviews: existingActivity.clientInterviews || 0,
        placementsMade: existingActivity.placementsMade || 0,
        timeToFill: existingActivity.timeToFill || 0,
        notes: existingActivity.notes || '',
      });
      setEditingActivity(existingActivity);
    } else {
      setFormData({
        cvsSourced: 0,
        screeningsConducted: 0,
        submissionsToClients: 0,
        inHouseInterviews: 0,
        clientInterviews: 0,
        placementsMade: 0,
        timeToFill: 0,
        notes: '',
      });
      setEditingActivity(null);
    }
    setIsModalOpen(true);
  };

  const handleJobChange = (job) => {
    if (!job) return;
    
    const existingActivity = activities.find(activity => 
      activity.jobId === job.id &&
      isWithinInterval(new Date(activity.timestamp), { start: weekStart, end: weekEnd })
    );

    setSelectedJob(job);
    
    if (existingActivity) {
      toast({
        title: "Existing Entry Found",
        description: `An entry for "${job.jobTitle}" already exists for this week. You can edit the existing entry if needed.`,
        duration: 5000,
        variant: "default",
        className: "bg-white border-gray-200",
      });
      
      setFormData({
        cvsSourced: existingActivity.cvsSourced || 0,
        screeningsConducted: existingActivity.screeningsConducted || 0,
        submissionsToClients: existingActivity.submissionsToClients || 0,
        inHouseInterviews: existingActivity.inHouseInterviews || 0,
        clientInterviews: existingActivity.clientInterviews || 0,
        placementsMade: existingActivity.placementsMade || 0,
        timeToFill: existingActivity.timeToFill || 0,
        notes: existingActivity.notes || '',
      });
      setEditingActivity(existingActivity);
    } else {
      setFormData({
        cvsSourced: 0,
        screeningsConducted: 0,
        submissionsToClients: 0,
        inHouseInterviews: 0,
        clientInterviews: 0,
        placementsMade: 0,
        timeToFill: 0,
        notes: '',
      });
      setEditingActivity(null);
    }
  };

  const hasExistingEntry = (jobId) => {
    return activities.some(activity => 
      activity.jobId === jobId &&
      isWithinInterval(new Date(activity.timestamp), { start: weekStart, end: weekEnd })
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'notes') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // For numeric fields, remove any non-numeric characters and convert to number
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue === '' ? 0 : parseInt(numericValue, 10)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedJob) {
      alert('Please select a job');
      return;
    }

    const newActivity = {
      id: editingActivity ? editingActivity.id : Date.now(),
      jobId: selectedJob.id,
      timestamp: editingActivity ? editingActivity.timestamp : new Date().toISOString(),
      recruiterName: "Current Recruiter", // You might want to get this from a context
      ...formData
    };

    if (editingActivity) {
      updateActivity(newActivity);
    } else {
      addActivity(newActivity);
    }

    setIsModalOpen(false);
    setSelectedJob(null);
    setEditingActivity(null);
    setFormData({
      cvsSourced: 0,
      screeningsConducted: 0,
      submissionsToClients: 0,
      inHouseInterviews: 0,
      clientInterviews: 0,
      placementsMade: 0,
      timeToFill: 0,
      notes: '',
    });
  };

  const getJobActivities = (jobId) => {
    return activities.filter(activity => 
      activity.jobId === jobId &&
      isWithinInterval(new Date(activity.timestamp), { start: weekStart, end: weekEnd })
    );
  };

  const calculateJobKPIs = (jobId) => {
    const jobActivities = getJobActivities(jobId);
    return jobActivities.reduce((acc, activity) => ({
      sourced: acc.sourced + (activity.cvsSourced || 0),
      screened: acc.screened + (activity.screeningsConducted || 0),
      submitted: acc.submitted + (activity.submissionsToClients || 0),
      interviewed: acc.interviewed + (activity.clientInterviews || 0),
      placed: acc.placed + (activity.placementsMade || 0),
    }), {
      sourced: 0,
      screened: 0,
      submitted: 0,
      interviewed: 0,
      placed: 0,
    });
  };

  const calculateProgress = (kpis) => {
    const totalActivities = kpis.sourced + kpis.screened + kpis.submitted;
    const progressPercentage = Math.min(100, (totalActivities / 10) * 100);

    if (totalActivities === 0) return { progress: 0, status: 'red' };
    if (progressPercentage >= 70) return { progress: progressPercentage, status: 'green' };
    if (progressPercentage >= 30) return { progress: progressPercentage, status: 'yellow' };
    return { progress: progressPercentage, status: 'red' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getWeeklyActivities = () => {
    return activities.filter(activity => 
      isWithinInterval(new Date(activity.timestamp), { start: weekStart, end: weekEnd })
    );
  };

  const calculateTotalSubmissions = () => {
    const weeklyActivities = getWeeklyActivities();
    return weeklyActivities.reduce((acc, activity) => acc + (activity.submissionsToClients || 0), 0);
  };

  const calculateTotalPlacements = () => {
    const weeklyActivities = getWeeklyActivities();
    return weeklyActivities.reduce((acc, activity) => acc + (activity.placementsMade || 0), 0);
  };

  const calculateTotalScreenings = () => {
    const weeklyActivities = getWeeklyActivities();
    return weeklyActivities.reduce((acc, activity) => acc + (activity.screeningsConducted || 0), 0);
  };

  const calculateActiveJobs = () => {
    const weeklyActivities = getWeeklyActivities();
    return new Set(weeklyActivities.map(activity => activity.jobId)).size;
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-6 bg-white p-6 rounded-lg border">
          {/* Title and Week Selection */}
          <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Weekly Activity Tracker</h1>
              <p className="text-muted-foreground">Track and manage your recruitment activities</p>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePreviousWeek}
                className="hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex flex-col items-center min-w-[160px]">
                <span className="text-sm font-medium">
                  {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(weekStart, 'yyyy')}
                </span>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNextWeek}
                className="hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Weekly Activities</div>
              <div className="text-2xl font-semibold">{getWeeklyActivities().length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Active Jobs</div>
              <div className="text-2xl font-semibold">{calculateActiveJobs()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total Submissions</div>
              <div className="text-2xl font-semibold">{calculateTotalSubmissions()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total Placements</div>
              <div className="text-2xl font-semibold">{calculateTotalPlacements()}</div>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {jobOrders.map((job) => {
            const hasEntry = hasExistingEntry(job.id);
            const kpis = calculateJobKPIs(job.id);
            const { progress, status } = calculateProgress(kpis);
            
            return (
              <div
                key={job.id}
                onClick={() => handleJobCardClick(job)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  hasEntry 
                    ? 'bg-gray-50 hover:bg-gray-100 border-gray-200' 
                    : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Header with Title and Action Icon */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{job.clientName}</h3>
                      <p className="text-sm text-gray-600">{job.jobTitle}</p>
                    </div>
                    {hasEntry ? (
                      <div className="flex items-center gap-2">
                        <PenSquare className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-500">Edit Entry</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-500">Add Entry</span>
                      </div>
                    )}
                  </div>

                  {/* KPI Summary */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span>{kpis.sourced} sourced</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{kpis.screened} screened</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-gray-500" />
                      <span>{kpis.submitted} submitted</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Weekly Progress</div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStatusColor(status)} transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Job</TableHead>
                <TableHead className="text-center">CVs</TableHead>
                <TableHead className="text-center">Screenings</TableHead>
                <TableHead className="text-center">Submissions</TableHead>
                <TableHead className="text-center">In-House</TableHead>
                <TableHead className="text-center">Client</TableHead>
                <TableHead className="text-center">Placements</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities
                .filter(activity => 
                  isWithinInterval(new Date(activity.timestamp), { 
                    start: weekStart, 
                    end: weekEnd 
                  })
                )
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {format(new Date(activity.timestamp), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{activity.jobId ? getJobTitle(activity.jobId) : 'N/A'}</TableCell>
                    <TableCell className="text-center">{activity.cvsSourced || 0}</TableCell>
                    <TableCell className="text-center">{activity.screeningsConducted || 0}</TableCell>
                    <TableCell className="text-center">{activity.submissionsToClients || 0}</TableCell>
                    <TableCell className="text-center">{activity.inHouseInterviews || 0}</TableCell>
                    <TableCell className="text-center">{activity.clientInterviews || 0}</TableCell>
                    <TableCell className="text-center">{activity.placementsMade || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(activity)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-8 py-2 px-4"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(activity.id)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-8 py-2 px-4"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Activity Entry Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 z-[49] bg-black/50" />
            <DialogContent className="fixed left-[50%] top-[50%] z-[50] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-white p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
              <DialogHeader className="space-y-1.5 p-6">
                <DialogTitle className="text-2xl font-semibold leading-none tracking-tight">
                  {editingActivity ? 'Edit Activity' : 'Add Weekly Activity'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="p-6 pt-0 space-y-4">
                  {/* Job Selection */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="job" className="text-right text-sm font-medium text-gray-500">
                      Job
                    </label>
                    <select
                      id="job"
                      value={selectedJob?.id || ''}
                      onChange={(e) => {
                        const selectedJobId = e.target.value;
                        const job = jobOrders.find(j => j.id === selectedJobId);
                        handleJobChange(job);
                      }}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a job</option>
                      {jobOrders.map((job) => {
                        const hasEntry = hasExistingEntry(job.id);
                        return (
                          <option 
                            key={job.id} 
                            value={job.id}
                            disabled={hasEntry}
                          >
                            {`${job.clientName} - ${job.jobTitle}`}
                            {hasEntry ? ' (Entry exists for this week)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-sm text-gray-500 mt-1 col-span-3">
                      Note: Jobs with existing entries for this week are disabled. Edit existing entries from the table below.
                    </p>
                  </div>

                  {/* KPI Fields */}
                  {['cvsSourced', 'screeningsConducted', 'submissionsToClients', 'inHouseInterviews', 
                    'clientInterviews', 'placementsMade', 'timeToFill'].map((field) => (
                    <div key={field} className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor={field} className="text-right text-sm font-medium text-gray-500">
                        {field.replace(/([A-Z])/g, ' $1').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter, and numbers
                          if (
                            e.key === 'Backspace' ||
                            e.key === 'Delete' ||
                            e.key === 'Tab' ||
                            e.key === 'Escape' ||
                            e.key === 'Enter' ||
                            /^[0-9]$/.test(e.key)
                          ) {
                            return;
                          }
                          e.preventDefault();
                        }}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  ))}

                  {/* Notes Field */}
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label htmlFor="notes" className="text-right text-sm font-medium text-gray-500 pt-2">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="col-span-3 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add any additional notes or context..."
                    />
                  </div>
                </div>

                <DialogFooter className="flex items-center justify-end space-x-2 border-t p-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedJob(null);
                      setEditingActivity(null);
                    }}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                  >
                    {editingActivity ? 'Update' : 'Save'} Activity
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
    </div>
  );
}