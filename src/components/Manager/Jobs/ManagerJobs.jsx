import React, { useState, useMemo } from 'react';
import { useJobOrders } from '../../../contexts/JobOrdersContext';
import { useRecruiterData } from '../../../contexts/RecruiterContext';
import { useToast } from '../../ui/use-toast';
import { Button } from '../../ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '../../ui/input';
import JobsTable from './JobsTable';
import JobForm from './JobForm';
import RecruiterActivityChart from './RecruiterActivityChart';
import JobProgressChart from './JobProgressChart';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

const ManagerJobs = () => {
  const { toast } = useToast();
  const { jobOrders, addJobOrder, updateJobOrder, deleteJobOrder } = useJobOrders();
  const { recruiters, assignJobToRecruiters, removeJobFromRecruiters } = useRecruiterData();
  
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter jobs based on search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobOrders;
    
    const query = searchQuery.toLowerCase();
    return jobOrders.filter(job => 
      job.title?.toLowerCase().includes(query) ||
      job.client?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query) ||
      job.status?.toLowerCase().includes(query) ||
      job.priority?.toLowerCase().includes(query) ||
      job.assignedRecruiters?.some(recruiter => 
        recruiter.name.toLowerCase().includes(query)
      )
    );
  }, [jobOrders, searchQuery]);

  const handleAddJob = () => {
    setSelectedJob(null);
    setFormMode('create');
    setIsJobFormOpen(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob({
      ...job,
      assignedRecruiters: job.assignedRecruiters || []
    });
    setFormMode('edit');
    setIsJobFormOpen(true);
  };

  const handleDeleteJob = (job) => {
    setSelectedJob(job);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedJob) {
      // Remove job from previously assigned recruiters
      if (selectedJob.assignedRecruiters && selectedJob.assignedRecruiters.length > 0) {
        const recruiterIds = selectedJob.assignedRecruiters.map(r => r.id);
        removeJobFromRecruiters(selectedJob.id, recruiterIds);
      }
      
      deleteJobOrder(selectedJob.id);
      toast({
        title: "Job Order Deleted",
        description: "The job order has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedJob(null);
    }
  };

  const handleJobSubmit = (data) => {
    const currentDate = new Date().toISOString();
    
    if (formMode === 'create') {
      const newJob = {
        ...data,
        id: Date.now(),
        dateAssigned: currentDate
      };
      
      addJobOrder(newJob);
      
      // Assign job to selected recruiters
      if (data.assignedRecruiters && data.assignedRecruiters.length > 0) {
        assignJobToRecruiters(newJob.id, data.assignedRecruiters.map(r => r.id));
      }
      
      toast({
        title: "Job Order Created",
        description: "New job order has been successfully created.",
      });
    } else {
      // Get current and new recruiter IDs
      const currentRecruiterIds = selectedJob.assignedRecruiters?.map(r => r.id) || [];
      const newRecruiterIds = data.assignedRecruiters.map(r => r.id);
      
      // Remove job from unassigned recruiters
      const removedRecruiterIds = currentRecruiterIds.filter(id => !newRecruiterIds.includes(id));
      if (removedRecruiterIds.length > 0) {
        removeJobFromRecruiters(selectedJob.id, removedRecruiterIds);
      }
      
      // Assign job to newly assigned recruiters
      const addedRecruiterIds = newRecruiterIds.filter(id => !currentRecruiterIds.includes(id));
      if (addedRecruiterIds.length > 0) {
        assignJobToRecruiters(selectedJob.id, addedRecruiterIds);
      }
      
      const updatedJob = {
        ...selectedJob,
        ...data
      };
      
      updateJobOrder(updatedJob);
      toast({
        title: "Job Order Updated",
        description: "The job order has been successfully updated.",
      });
    }
    setIsJobFormOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-end items-center bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center gap-6 w-full max-w-4xl">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search jobs by title, client, location, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-base w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button 
            onClick={handleAddJob}
            className="px-6 py-6 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Job
          </Button>
        </div>
      </div>

      {/* Jobs Table */}
      <JobsTable
        jobs={filteredJobs}
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
        onAssign={handleEditJob}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RecruiterActivityChart 
          data={recruiters.map(recruiter => ({
            name: recruiter.name,
            activeJobs: recruiter.activeJobs || [],
            submissions: recruiter.cvsSourced || 0,
            interviews: recruiter.weeklyMetrics?.clientInterviews?.current || 0
          }))}
        />
        <JobProgressChart 
          data={[
            {
              date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              openJobs: jobOrders.filter(job => job.status === 'Open').length || 0,
              inProgressJobs: jobOrders.filter(job => job.status === 'In Progress').length || 0,
              closedJobs: jobOrders.filter(job => job.status === 'Closed').length || 0,
            }
          ]}
        />
      </div>

      {/* Job Form Dialog */}
      <JobForm
        open={isJobFormOpen}
        onOpenChange={setIsJobFormOpen}
        onSubmit={handleJobSubmit}
        initialData={selectedJob}
        recruiters={recruiters}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the job order
              and remove it from all assigned recruiters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t pt-4">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Job Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManagerJobs;
