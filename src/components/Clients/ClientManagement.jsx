import { useContext, useState, useEffect } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext.jsx';
import { useJobOrders } from '../../context/JobOrderContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table.jsx';
import { mockRecruiters } from '../../utils/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog.jsx';

const calculateCommission = (salary) => {
  return salary * 0.08; // 8% commission
};

const NewJobModal = ({ isOpen, onClose, editingJob = null }) => {
  const { addJobOrder, updateJobOrder, clients, addClient } = useJobOrders();
  const [formData, setFormData] = useState({
    clientName: '',
    newClientName: '',
    jobTitle: '',
    location: '',
    salary: '',
    receivedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    recruiter: '',
    status: 'Open',
    priority: 'Medium'
  });

  const [commission, setCommission] = useState(0);
  const [isNewClient, setIsNewClient] = useState(false);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        ...editingJob,
        newClientName: '',
      });
      setCommission(calculateCommission(editingJob.salary));
    }
  }, [editingJob]);

  useEffect(() => {
    if (formData.salary) {
      setCommission(calculateCommission(Number(formData.salary)));
    }
  }, [formData.salary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalClientName = isNewClient ? formData.newClientName : formData.clientName;
    
    if (isNewClient) {
      addClient({ name: formData.newClientName });
    }

    const jobData = {
      ...formData,
      clientName: finalClientName,
      commission,
      salary: Number(formData.salary),
    };

    if (editingJob) {
      updateJobOrder({ ...jobData, id: editingJob.id });
    } else {
      addJobOrder(jobData);
    }

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingJob ? 'Edit Job Order' : 'Create New Job'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <div className="flex space-x-2">
                <Select
                  disabled={isNewClient || editingJob}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, clientName: value }))}
                  value={formData.clientName}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!editingJob && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewClient(!isNewClient)}
                  >
                    {isNewClient ? 'Select Existing' : 'New Client'}
                  </Button>
                )}
              </div>
            </div>

            {isNewClient && !editingJob && (
              <div className="space-y-2">
                <Label htmlFor="newClientName">New Client Name</Label>
                <Input
                  id="newClientName"
                  name="newClientName"
                  value={formData.newClientName}
                  onChange={handleChange}
                  required={isNewClient}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Commission (8%)</Label>
              <Input
                value={`$${commission.toLocaleString()}`}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivedDate">Received Date</Label>
              <Input
                id="receivedDate"
                name="receivedDate"
                type="date"
                value={formData.receivedDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Recruiter</Label>
              <Select
                onValueChange={(value) => setFormData(prev => ({ ...prev, recruiter: value }))}
                value={formData.recruiter}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recruiter" />
                </SelectTrigger>
                <SelectContent>
                  {mockRecruiters.map(recruiter => (
                    <SelectItem key={recruiter.id} value={recruiter.name}>
                      {recruiter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                value={formData.priority}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editingJob ? 'Save Changes' : 'Create Job'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, jobTitle }) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Job Order</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete the job order for "{jobTitle}"? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const ClientManagement = () => {
  const { userRole } = useContext(UserRoleContext);
  const { jobOrders, deleteJobOrder } = useJobOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteJob, setDeleteJob] = useState(null);

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDelete = (job) => {
    setDeleteJob(job);
  };

  const confirmDelete = () => {
    if (deleteJob) {
      deleteJobOrder(deleteJob.id);
      setDeleteJob(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Job Orders</CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>
            New Job
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>{order.jobTitle}</TableCell>
                  <TableCell>{order.location}</TableCell>
                  <TableCell>${order.salary.toLocaleString()}</TableCell>
                  <TableCell>${calculateCommission(order.salary).toLocaleString()}</TableCell>
                  <TableCell>{order.receivedDate}</TableCell>
                  <TableCell>{order.dueDate}</TableCell>
                  <TableCell>{order.recruiter}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.priority}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(order)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(order)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <NewJobModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        editingJob={editingJob}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteJob}
        onClose={() => setDeleteJob(null)}
        onConfirm={confirmDelete}
        jobTitle={deleteJob?.jobTitle}
      />
    </div>
  );
};

export default ClientManagement;
