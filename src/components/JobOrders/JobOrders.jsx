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
import { Plus, Search, ChevronDown, X, Eye } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../ui/use-toast";
import { useUserRole } from '../../contexts/UserRoleContext';

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
  const [showInlineClientForm, setShowInlineClientForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientName: editingJob?.clientName || '',
    jobTitle: editingJob?.jobTitle || '',
    location: editingJob?.location || '',
    salary: editingJob?.salary || '',
    receivedDate: editingJob?.receivedDate || new Date().toISOString().split('T')[0],
    dueDate: editingJob?.dueDate || new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
    status: editingJob?.status || 'Open',
    priority: editingJob?.priority || 'Medium',
    commission: editingJob?.commission || 0
  });

  const [newClientData, setNewClientData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    if (editingJob) {
      setFormData({
        clientName: editingJob.clientName || '',
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
      salary: Number(formData.salary),
      commission: Number(formData.salary) * 0.08
    };

    if (editingJob) {
      updateJobOrder({ ...jobData, id: editingJob.id });
    } else {
      addJobOrder(jobData);
    }
    onClose();
    
    toast({
      title: "Start Planning",
      description: "Let's plan your recruitment activities for this job order.",
      action: (
        <Button 
          onClick={() => navigate('/planning')}
          className="bg-black text-white hover:bg-yellow-500 hover:text-black transition-colors duration-200"
        >
          Start Planning
        </Button>
      ),
      dismissible: true,
    });
  };

  const handleNewClientSubmit = (e) => {
    e.preventDefault();
    if (!newClientData.companyName.trim()) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    addClient(newClientData.companyName);
    setFormData(prev => ({
      ...prev,
      clientName: newClientData.companyName
    }));
    
    toast({
      title: "Success",
      description: "New client has been registered successfully",
    });
    
    setShowInlineClientForm(false);
    setNewClientData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      location: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
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
                  {!showInlineClientForm ? (
                    <div className="flex space-x-2">
                      <select
                        className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        required
                      >
                        <option value="">Select existing client</option>
                        {clients.map(client => (
                          <option key={client} value={client}>{client}</option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowInlineClientForm(true)}
                      >
                        Register New Client
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">New Client Registration</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowInlineClientForm(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Company Name *</Label>
                          <Input
                            value={newClientData.companyName}
                            onChange={(e) => setNewClientData({ ...newClientData, companyName: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Contact Person</Label>
                          <Input
                            value={newClientData.contactName}
                            onChange={(e) => setNewClientData({ ...newClientData, contactName: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={newClientData.email}
                            onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={newClientData.phone}
                            onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={newClientData.location}
                            onChange={(e) => setNewClientData({ ...newClientData, location: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowInlineClientForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={handleNewClientSubmit}
                            className="bg-black text-white hover:bg-yellow-500 hover:text-black transition-colors duration-200"
                          >
                            Add Client
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-yellow-500 hover:text-black transition-colors duration-200"
            >
              {editingJob ? 'Update Job Order' : 'Create Job Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ViewJobOrderModal = ({ isOpen, onClose, jobOrder }) => {
  if (!jobOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <Eye className="h-6 w-6" />
            Job Order Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Information Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                <dd className="text-base text-gray-900">{jobOrder.clientName}</dd>
              </div>
            </dl>
          </div>

          {/* Job Order Information Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                <dd className="text-base text-gray-900">{jobOrder.jobTitle}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="text-base text-gray-900">{jobOrder.location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Salary</dt>
                <dd className="text-base text-gray-900">${jobOrder.salary?.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Commission</dt>
                <dd className="text-base text-gray-900">${jobOrder.commission?.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          {/* Status Information Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Status Information</h3>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-base">
                  <Badge className={statusColors[jobOrder.status]}>{jobOrder.status}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Priority</dt>
                <dd className="text-base">
                  <Badge className={priorityColors[jobOrder.priority]}>{jobOrder.priority}</Badge>
                </dd>
              </div>
            </dl>
          </div>

          {/* Timeline Information Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Received Date</dt>
                <dd className="text-base text-gray-900">
                  {new Date(jobOrder.receivedDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                <dd className="text-base text-gray-900">
                  {new Date(jobOrder.dueDate).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={onClose}
            className="bg-black text-white hover:bg-yellow-500 hover:text-black transition-colors duration-200"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function JobOrders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { jobOrders, addJobOrder, updateJobOrder, deleteJobOrder, clients } = useJobOrders();
  const { userRole, users } = useUserRole();
  const location = useLocation();

  // Handle incoming navigation with job to edit
  useEffect(() => {
    if (location.state?.editingJob) {
      setEditingJob(location.state.editingJob);
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getAccessibleJobs = () => {
    if (userRole === 'manager' || userRole === 'admin') {
      return jobOrders;
    }
    
    // For recruiters, only return jobs they're assigned to
    const currentUser = users.find(user => user.role === userRole);
    if (!currentUser) return [];

    return jobOrders.filter(job => 
      job.assignedRecruiters.some(recruiter => 
        recruiter.toLowerCase() === currentUser.email.toLowerCase()
      )
    );
  };

  const filteredJobOrders = getAccessibleJobs().filter((job) => {
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
    <div className="container mx-auto py-10">
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
                <TableHead className="w-[150px]">Salary</TableHead>
                <TableHead className="w-[150px]">Commission</TableHead>
                <TableHead className="w-[150px]">Received Date</TableHead>
                <TableHead className="w-[150px]">Due Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobOrders.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.clientName}</TableCell>
                  <TableCell>{job.jobTitle}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[job.status]}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[job.priority]}>
                      {job.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>${job.salary?.toLocaleString()}</TableCell>
                  <TableCell>${job.commission?.toLocaleString()}</TableCell>
                  <TableCell>{new Date(job.receivedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(job.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job);
                          setViewModalOpen(true);
                        }}
                        className="p-0 hover:bg-transparent"
                      >
                        <Eye className="h-4 w-4 text-gray-500 hover:text-black transition-colors" />
                      </Button>
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
                    </div>
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

      {viewModalOpen && (
        <ViewJobOrderModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          jobOrder={selectedJob}
        />
      )}
    </div>
  );
}
