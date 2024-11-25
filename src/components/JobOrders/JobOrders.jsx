import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useJobOrders } from '../../contexts/JobOrdersContext';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../ui/use-toast";

const statusColors = {
  'Open': 'bg-green-500',
  'Hold': 'bg-yellow-500',
  'Closed': 'bg-red-500',
  'Placed': 'bg-blue-500'
};

const priorityColors = {
  'High': 'bg-red-500',
  'Medium': 'bg-yellow-500',
  'Low': 'bg-green-500'
};

const NewJobModal = ({ isOpen, onClose, editingJob = null }) => {
  const { addJobOrder, updateJobOrder, clients, addClient } = useJobOrders();
  const [isNewClient, setIsNewClient] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clientName: editingJob?.clientName || '',
    newClientName: '',
    jobTitle: editingJob?.jobTitle || '',
    location: editingJob?.location || '',
    salary: editingJob?.salary || '',
    receivedDate: editingJob?.receivedDate || new Date().toISOString().split('T')[0],
    dueDate: editingJob?.dueDate || '',
    status: editingJob?.status || 'Open',
    priority: editingJob?.priority || 'Medium',
    commission: editingJob?.commission || 0
  });

  useEffect(() => {
    if (editingJob) {
      setFormData({
        clientName: editingJob.clientName || '',
        newClientName: '',
        jobTitle: editingJob.jobTitle || '',
        location: editingJob.location || '',
        salary: editingJob.salary || '',
        receivedDate: editingJob.receivedDate || new Date().toISOString().split('T')[0],
        dueDate: editingJob.dueDate || '',
        status: editingJob.status || 'Open',
        priority: editingJob.priority || 'Medium',
        commission: editingJob.commission || 0
      });
    }
  }, [editingJob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = {
      ...formData,
      clientName: isNewClient ? formData.newClientName : formData.clientName,
      salary: Number(formData.salary),
      commission: Number(formData.salary) * 0.08 // 8% commission
    };

    if (isNewClient && formData.newClientName) {
      addClient(formData.newClientName);
    }

    if (editingJob) {
      updateJobOrder({ ...jobData, id: editingJob.id });
      onClose();
    } else {
      addJobOrder(jobData);
      onClose();
      // Show toast notification
      toast({
        title: "Start Planning",
        description: "Let's plan your recruitment activities for this job order.",
        action: (
          <Button 
            onClick={() => {
              navigate('/planning');
            }}
            className="bg-black text-white hover:bg-yellow-500 hover:text-black transition-colors duration-200"
          >
            Start Planning
          </Button>
        ),
        dismissible: true, // Enable dismiss button
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-[60] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingJob ? 'Edit Job Order' : 'New Job Order'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Client</Label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1">
                  {isNewClient ? (
                    <Input
                      placeholder="Enter new client name"
                      value={formData.newClientName}
                      onChange={(e) => setFormData({ ...formData, newClientName: e.target.value })}
                      required
                    />
                  ) : (
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      required
                    >
                      <option value="">Select existing client</option>
                      {clients.map(client => (
                        <option key={client} value={client}>{client}</option>
                      ))}
                    </select>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewClient(!isNewClient)}
                >
                  {isNewClient ? 'Use Existing Client' : 'Add New Client'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="Open">Open</option>
                <option value="Hold">Hold</option>
                <option value="Closed">Closed</option>
                <option value="Placed">Placed</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Salary</Label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Commission (8%)</Label>
              <Input
                type="number"
                value={formData.salary ? Number(formData.salary) * 0.08 : 0}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>Received Date</Label>
              <Input
                type="date"
                value={formData.receivedDate}
                onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
            >
              {editingJob ? 'Update Job Order' : 'Create Job Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function JobOrders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { jobOrders, addJobOrder, updateJobOrder, deleteJobOrder, clients } = useJobOrders();
  const location = useLocation();

  // Handle incoming navigation with job to edit
  useEffect(() => {
    if (location.state?.editingJob) {
      setEditingJob(location.state.editingJob);
      setIsModalOpen(true);
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredJobOrders = jobOrders.filter((job) => {
    const matchesSearch =
      job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDelete = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job order?')) {
      deleteJobOrder(jobId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Orders</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Job Order
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by client, job title, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="Hold">Hold</option>
            <option value="Closed">Closed</option>
            <option value="Placed">Placed</option>
          </select>
          <select
            className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Client Name</TableHead>
                <TableHead className="w-[250px]">Job Title</TableHead>
                <TableHead className="w-[150px]">Location</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Priority</TableHead>
                <TableHead className="w-[150px]">Received Date</TableHead>
                <TableHead className="w-[150px]">Due Date</TableHead>
                <TableHead className="w-[150px]">Salary</TableHead>
                <TableHead className="w-[120px]">Commission</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobOrders.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.clientName}</TableCell>
                  <TableCell>{job.jobTitle}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        job.status === 'Open'
                          ? 'bg-black text-white'
                          : 'bg-white text-black border border-gray-200'
                      }`}
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        job.priority === 'High'
                          ? 'bg-black text-white'
                          : 'bg-white text-black border border-gray-200'
                      }`}
                    >
                      {job.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.receivedDate}</TableCell>
                  <TableCell>{job.dueDate}</TableCell>
                  <TableCell>{job.salary}</TableCell>
                  <TableCell>{job.commission}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(job)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job Order' : 'New Job Order'}</DialogTitle>
          </DialogHeader>
          <NewJobModal isOpen={isModalOpen} onClose={handleCloseModal} editingJob={editingJob} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
