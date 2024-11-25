import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Info,
  PencilLine,
  Filter,
  ChevronDown,
  Calendar,
  ChevronLeft as ChevronLeftIcon,
  PlusIcon,
  ChevronRight as ChevronRightIcon,
  FilterIcon,
  MenuIcon,
  Edit
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { format, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval, addDays, startOfMonth, endOfMonth, isSameDay, isSameMonth, subMonths, addMonths } from 'date-fns';
import { cn } from '../../lib/utils';
import { useJobOrders } from '../../contexts/JobOrdersContext';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useWeeklyActivity } from '../../contexts/WeeklyActivityContext';
import { useNavigate } from 'react-router-dom';

const recruitmentSteps = [
  { id: 1, title: 'Review & Research Job Order Details', color: 'bg-yellow-500' },
  { id: 2, title: 'Job Posting', color: 'bg-blue-500' },
  { id: 3, title: 'Source Candidates', color: 'bg-green-500' },
  { id: 4, title: 'Screen Resumes and Applications', color: 'bg-purple-500' },
  { id: 5, title: 'Conduct Initial Interviews', color: 'bg-pink-500' },
  { id: 6, title: 'Shortlist Qualified Candidates', color: 'bg-orange-500' },
  { id: 7, title: 'Present Candidates to Client/Hiring Manager', color: 'bg-cyan-500' },
  { id: 8, title: 'Coordinate Client Interviews', color: 'bg-indigo-500' },
  { id: 9, title: 'Gather Feedback from Client and Candidates', color: 'bg-teal-500' },
  { id: 10, title: 'Conduct Reference Checks', color: 'bg-red-500' },
  { id: 11, title: 'Facilitate Offer Negotiation', color: 'bg-emerald-500' },
  { id: 12, title: 'Assist with Onboarding Process', color: 'bg-violet-500' },
  { id: 13, title: 'Close the Job Order and Update Records', color: 'bg-amber-500' },
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute of ['30', '00']) {
      if (hour === 8 && minute === '00') continue;
      if (hour === 18 && minute === '30') break;
      slots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const generateDurationOptions = () => {
  const options = [];
  for (let minutes = 15; minutes <= 480; minutes += 15) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const label = hours > 0 
      ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
      : `${mins}m`;
    options.push({ value: minutes, label });
  }
  return options;
};

const durationOptions = generateDurationOptions();

const CalendarHeader = ({ startDate, onPrevious, onNext }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onPrevious}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onNext}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold">
          {format(startDate, 'MMMM yyyy')}
        </h2>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const today = new Date();
          setStartDate(today);
        }}
      >
        Today
      </Button>
    </div>
  );
};

const CalendarView = ({ selectedJob, startDate, onDateChange }) => {
  const { schedule } = useSchedule();
  
  // Get the start and end of the month
  const start = startOfMonth(startDate);
  const end = endOfMonth(startDate);
  
  // Get all days in the month
  const days = eachDayOfInterval({ start, end });
  
  // Group schedule items by date
  const scheduleByDate = useMemo(() => {
    if (!Array.isArray(schedule)) return {};
    
    return schedule.reduce((acc, item) => {
      if (!item.date) return acc;
      
      const dateKey = format(new Date(item.date), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [schedule]);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">
          {format(startDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(subMonths(startDate, 1))}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(addMonths(startDate, 1))}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-4">
          {days.map((day, dayIdx) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const daySchedule = scheduleByDate[dateKey] || [];
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, startDate);

            return (
              <div
                key={day.toString()}
                className={cn(
                  'min-h-[100px] p-2 border rounded-lg',
                  isToday && 'bg-yellow-50 border-yellow-200',
                  !isCurrentMonth && 'bg-gray-50',
                  'hover:border-yellow-300 transition-colors'
                )}
              >
                {/* Date number */}
                <div className="text-right text-sm mb-1">
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full',
                      isToday && 'bg-yellow-400 text-black font-medium',
                      !isCurrentMonth && 'text-gray-400'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Schedule items */}
                <div className="space-y-1">
                  {daySchedule.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className={cn(
                        'text-xs p-1 rounded truncate',
                        item.type === 'interview' && 'bg-blue-100 text-blue-700',
                        item.type === 'followup' && 'bg-green-100 text-green-700',
                        item.type === 'deadline' && 'bg-red-100 text-red-700'
                      )}
                      title={item.title}
                    >
                      {item.startTime && (
                        <span className="font-medium mr-1">{item.startTime}</span>
                      )}
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const JobDetailsModal = ({ open, onOpenChange, job }) => {
  const { schedule, updateScheduleItem } = useSchedule();
  const { activities } = useWeeklyActivity();
  const navigate = useNavigate();
  
  const jobSchedule = useMemo(() => {
    return schedule
      .filter(item => item.jobId === job?.id)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [schedule, job?.id]);

  const handleToggleActivity = (activity) => {
    const updatedActivity = {
      ...activity,
      completed: !activity.completed,
      status: !activity.completed ? 'completed' : 'in_progress'
    };
    
    try {
      updateScheduleItem(activity.id, {
        completed: !activity.completed,
        status: !activity.completed ? 'completed' : 'in_progress'
      });
    } catch (error) {
      console.error('Failed to update activity status:', error);
    }
  };

  const jobScheduleWithStatus = useMemo(() => {
    return jobSchedule.map(activity => ({
      ...activity,
      status: activity.completed ? 'completed' : 'in_progress'
    }));
  }, [jobSchedule]);

  const calculateLifecycleProgress = () => {
    if (!job?.receivedDate || !job?.dueDate) return { progress: 0, remainingPercentage: 100 };
    
    const today = new Date();
    const receivedDate = new Date(job.receivedDate);
    const dueDate = new Date(job.dueDate);
    
    // If past due date, return 100%
    if (today > dueDate) return { progress: 100, remainingPercentage: 0 };
    
    // If before received date, return 0%
    if (today < receivedDate) return { progress: 0, remainingPercentage: 100 };
    
    const totalDuration = dueDate - receivedDate;
    const elapsedDuration = today - receivedDate;
    const remainingDuration = dueDate - today;
    
    const progress = (elapsedDuration / totalDuration) * 100;
    const remainingPercentage = (remainingDuration / totalDuration) * 100;
    
    return {
      progress: Math.min(Math.max(progress, 0), 100),
      remainingPercentage: Math.min(Math.max(remainingPercentage, 0), 100)
    };
  };

  const getProgressColor = (remainingPercentage) => {
    if (remainingPercentage <= 0) return 'bg-red-500'; // Overdue
    if (remainingPercentage <= 10) return 'bg-red-500'; // Less than 10% time remaining
    if (remainingPercentage <= 20) return 'bg-yellow-500'; // Less than 20% time remaining
    return 'bg-gray-500'; // On track
  };

  const getProgressTextColor = (remainingPercentage) => {
    if (remainingPercentage <= 20) return 'text-red-600'; // Critical or warning state
    return 'text-gray-600'; // Normal state
  };

  const { progress, remainingPercentage } = calculateLifecycleProgress();
  const progressColor = getProgressColor(remainingPercentage);
  const textColor = getProgressTextColor(remainingPercentage);
  
  const handleEditJob = () => {
    onOpenChange(false); // Close the modal
    navigate('/job-orders', { state: { editingJob: job } }); // Navigate to job orders with the job to edit
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800 border-green-300';
      case 'hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'closed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const calculateTimeToFill = (startDate, filledDate) => {
    if (!startDate || !filledDate) return null;
    const start = new Date(startDate);
    const end = new Date(filledDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculatePotentialCommission = (salary, rate) => {
    if (!salary || !rate) return null;
    return (salary * (rate / 100)).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Calculate candidate pipeline metrics from weekly activities
  const candidatePipeline = useMemo(() => {
    // Get all activities for this job
    const jobActivities = activities.filter(activity => activity.jobId === job?.id);
    
    // Sum up the metrics
    return jobActivities.reduce((acc, activity) => ({
      sourced: acc.sourced + (activity.cvsSourced || 0),
      screened: acc.screened + (activity.screeningsConducted || 0),
      submitted: acc.submitted + (activity.submissionsToClients || 0)
    }), {
      sourced: 0,
      screened: 0,
      submitted: 0
    });
  }, [activities, job?.id]);

  const timeToFill = calculateTimeToFill(job?.dateReceived, job?.filledDate);
  const potentialCommission = calculatePotentialCommission(job?.salary, job?.commissionRate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[500px] bg-white rounded-lg shadow-lg border p-6 z-50" 
        closeButton={false}
      >
        <div className="mb-4">
          <DialogTitle className="text-xl font-semibold">{job?.jobTitle}</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">{job?.clientName}</p>
          
          {/* Time Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Time Progress</span>
              <span className={`text-sm font-medium ${textColor}`}>
                {Math.round(progress)}% Time Elapsed
                {remainingPercentage <= 20 && (
                  <span className="ml-2 text-xs">
                    ({Math.round(remainingPercentage)}% time remaining)
                  </span>
                )}
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`${progressColor} h-2.5 rounded-full transition-all duration-300`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Start: {job?.receivedDate ? new Date(job.receivedDate).toLocaleDateString() : 'N/A'}</span>
                <span>Due: {job?.dueDate ? new Date(job.dueDate).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          {/* Status and Priority Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={cn("px-2 py-1", getStatusColor(job?.status))}>
              Status: {job?.status || 'Not specified'}
            </Badge>
            <Badge className={cn("px-2 py-1", getPriorityColor(job?.priority))}>
              Priority: {job?.priority || 'Not specified'}
            </Badge>
          </div>

          {/* Job Details Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Planned Activities Card */}
            <Card className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Planned Activities</h3>
              <div className="space-y-2">
                {jobScheduleWithStatus.length === 0 ? (
                  <p className="text-sm text-gray-500">No activities planned yet</p>
                ) : (
                  jobScheduleWithStatus.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={activity.completed || false}
                          onChange={() => handleToggleActivity(activity)}
                          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                          aria-label={`Mark ${activity.title} as ${activity.completed ? 'incomplete' : 'complete'}`}
                        />
                        <div className={cn(
                          "transition-opacity",
                          activity.completed && "opacity-50"
                        )}>
                          <p className="text-sm font-medium">
                            {recruitmentSteps.find(step => step.id === activity.taskId)?.title || activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className={cn(
                          "px-2 py-1 text-xs transition-colors",
                          activity.completed 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {activity.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Candidate Pipeline Card */}
            <Card className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Candidates Pipeline</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-lg font-semibold block">
                      {candidatePipeline.sourced}
                    </span>
                    <span className="text-xs text-gray-600">Sourced</span>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-lg font-semibold block">
                      {candidatePipeline.screened}
                    </span>
                    <span className="text-xs text-gray-600">Screened</span>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-lg font-semibold block">
                      {candidatePipeline.submitted}
                    </span>
                    <span className="text-xs text-gray-600">Submitted</span>
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        Pipeline Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {Math.round((candidatePipeline.submitted / (candidatePipeline.sourced || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${(candidatePipeline.submitted / (candidatePipeline.sourced || 1)) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button 
              variant="default"
              onClick={handleEditJob}
              className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
            >
              Edit Job Order
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const JobCard = ({ job, isSelected, onClick }) => {
  const { addScheduleItem } = useSchedule();
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleSaveActivity = (planDetails) => {
    const { taskId, day, startTime, durationMinutes, notes } = planDetails;
    const task = recruitmentSteps.find(step => step.id === parseInt(taskId));
    
    if (!task) return;

    addScheduleItem({
      taskId: parseInt(taskId),
      title: task.title,
      date: day,
      startTime,
      durationMinutes,
      notes,
      jobId: job.id,
      type: 'recruitment',
      color: task.color
    });
    setIsPlanningModalOpen(false);
  };

  return (
    <Card 
      className={cn(
        "mb-3 cursor-pointer transition-all hover:border-yellow-500",
        isSelected && "border-yellow-500"
      )}
      onClick={() => onClick(job)}
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold line-clamp-2">
              {job.jobTitle}
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              {job.clientName}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "ml-2",
              job.status === 'Open' && "border-green-500 text-green-700",
              job.status === 'Hold' && "border-yellow-500 text-yellow-700",
              job.status === 'Closed' && "border-gray-500 text-gray-700"
            )}
          >
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mt-2 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailsModalOpen(true);
                  }}
                >
                  <Info className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View job details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlanningModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Activity
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Schedule new activity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>

      <PlanningModal
        open={isPlanningModalOpen}
        onOpenChange={setIsPlanningModalOpen}
        onSave={handleSaveActivity}
        selectedJob={job}
      />

      <JobDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        job={job}
      />
    </Card>
  );
};

const PlanningModal = ({ open, onOpenChange, onSave, selectedJob }) => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('08:30');
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    
    if (!selectedActivity || !selectedDay || !startTime || !duration) {
      console.error('Missing required fields');
      return;
    }

    const planDetails = {
      taskId: selectedActivity,
      day: selectedDay,
      startTime,
      durationMinutes: parseInt(duration),
      notes
    };

    console.log('Saving plan details:', planDetails);
    onSave(planDetails);

    // Reset form
    setSelectedActivity('');
    setSelectedDay(format(new Date(), 'yyyy-MM-dd'));
    setStartTime('08:30');
    setDuration('60');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[450px] bg-white rounded-lg shadow-lg border p-6 z-50" 
        closeButton={false}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            Plan Activity for {selectedJob?.jobTitle}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity" className="text-sm font-medium">
              Activity
            </Label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an activity" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {recruitmentSteps.map(step => (
                  <SelectItem key={step.id} value={step.id.toString()}>
                    {step.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="day" className="text-sm font-medium">
              Day
            </Label>
            <Input
              type="date"
              id="day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-time" className="text-sm font-medium">
              Start Time
            </Label>
            <Input
              id="start-time"
              type="time"
              min="08:30"
              max="18:30"
              step="900"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Duration
            </Label>
            <Select value={duration} onValueChange={setDuration} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[200px]">
                {durationOptions.map(option => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <Input
              id="notes"
              placeholder="Add any notes or details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full"
            />
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              Save Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const WeeklyPlanning = () => {
  const { jobOrders } = useJobOrders();
  const { schedule, addScheduleItem } = useSchedule();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const filteredJobs = useMemo(() => {
    return jobOrders.filter(job => {
      const matchesSearch = !searchQuery || 
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !statusFilter || statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [jobOrders, searchQuery, statusFilter]);

  const handleTaskSchedule = (planDetails) => {
    const { taskId, day, startTime, durationMinutes, notes } = planDetails;
    const task = recruitmentSteps.find(step => step.id === taskId);
    
    if (!task || !selectedJob) return;

    addScheduleItem({
      taskId,
      day,
      startTime,
      durationMinutes,
      notes,
      jobId: selectedJob.id,
      task
    });

    setIsModalOpen(false);
  };

  const handlePreviousPeriod = () => {
    setStartDate(prev => subMonths(prev, 1));
  };

  const handleNextPeriod = () => {
    setStartDate(prev => addMonths(prev, 1));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:relative h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-20",
          "flex flex-col",
          isSidebarOpen ? "w-[300px]" : "w-0 lg:w-[60px]"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className={cn(
            "font-semibold transition-opacity",
            isSidebarOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
          )}>
            My Jobs
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className={cn(
          "p-4 space-y-3 border-b border-gray-200",
          !isSidebarOpen && "hidden"
        )}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search jobs..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Hold">On Hold</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job List */}
        <ScrollArea className={cn(
          "flex-1",
          !isSidebarOpen && "hidden"
        )}>
          <div className="p-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onClick={setSelectedJob}
              />
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 p-4 lg:p-6 transition-all duration-300",
        !isSidebarOpen ? "ml-0 lg:ml-[60px]" : "ml-[300px] lg:ml-0"
      )}>
        <CalendarView
          selectedJob={selectedJob}
          startDate={startDate}
          onDateChange={setStartDate}
        />
      </main>

      {/* Planning Modal */}
      <PlanningModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleTaskSchedule}
        selectedJob={selectedJob}
      />
    </div>
  );
};

export default WeeklyPlanning;
