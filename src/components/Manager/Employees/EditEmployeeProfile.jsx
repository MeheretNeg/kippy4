import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Input } from '../../ui/input';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import { ChevronLeft, ChevronRight, Loader2, CalendarIcon, Upload, ArrowLeft, X } from 'lucide-react';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { useToast } from '../../ui/use-toast';
import QuickInfoCard from './shared/QuickInfoCard';
import LeaveBalanceCard from './shared/LeaveBalanceCard';
import LeaveCalendar from './shared/LeaveCalendar';
import LeaveRequestDialog from './shared/LeaveRequestDialog';

const LEAVE_TYPES = {
  paid: { label: 'Paid Leave', color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' },
  unpaid: { label: 'Unpaid Leave', color: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' },
  sick: { label: 'Sick Leave', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200' },
  maternity: { label: 'Maternity Leave', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200' }
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function EditEmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [approvedLeaves, setApprovedLeaves] = useState([
    // Mock data for approved leaves
    {
      id: 1,
      type: 'paid',
      startDate: new Date(2024, 11, 20),
      endDate: new Date(2024, 11, 25),
      comment: 'Year-end vacation'
    },
    {
      id: 2,
      type: 'sick',
      startDate: new Date(2024, 11, 10),
      endDate: new Date(2024, 11, 12),
      comment: 'Medical appointment'
    }
  ]);
  
  const form = useForm({
    defaultValues: {
      firstName: '',
      surname: '',
      email: '',
      address: '',
      gender: '',
      employmentType: '',
      weeklyHours: 40,
      grossSalary: '',
      tinNumber: '',
      bankName: '',
      accountNumber: '',
      emergencyContactName: '',
      emergencyContactRelation: '',
      emergencyContactPhone: '',
      paidHolidays: 25,
      unpaidLeaveBalance: 0,
      sickDaysBalance: 10,
      maternityProtectionStart: null,
    }
  });

  const [absenceType, setAbsenceType] = useState('');
  const [absenceStartDate, setAbsenceStartDate] = useState(null);
  const [absenceEndDate, setAbsenceEndDate] = useState(null);
  const [absenceComment, setAbsenceComment] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeInput, setActiveInput] = useState(null); // 'start' or 'end'
  const [absenceLoading, setAbsenceLoading] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);

  const { toast } = useToast();

  useEffect(() => {
    // In a real application, fetch employee data from API
    const mockEmployee = {
      id: parseInt(id),
      firstName: 'John',
      surname: 'Doe',
      gender: 'male',
      email: 'john.doe@company.com',
      position: 'Senior Recruiter',
      department: 'Recruitment',
      address: '123 Main St',
      photo: '',
      employmentType: '',
      weeklyHours: 40,
      hireDate: new Date(),
      grossSalary: '',
      tinNumber: '',
      bankName: '',
      accountNumber: '',
      emergencyContactName: '',
      emergencyContactRelation: '',
      emergencyContactPhone: '',
      paidHolidays: 25,
      unpaidLeaveBalance: 0,
      sickDaysBalance: 10,
      maternityProtectionStart: null,
    };
    
    setEmployee(mockEmployee);
    form.reset(mockEmployee);
  }, [id, form]);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch(`/api/absences/${id}`);
        if (response.ok) {
          const data = await response.json();
          setLeaveRequests(data);
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    if (id) {
      fetchLeaveRequests();
    }
  }, [id]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  const isDateInLeave = (date) => {
    return leaveRequests.find(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      return date >= start && date <= end;
    });
  };

  const getLeaveTypeForDate = (date) => {
    const leave = isDateInLeave(date);
    return leave ? LEAVE_TYPES[leave.type.toLowerCase()] : null;
  };

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Generate array of years (current year - 1 to current year + 5)
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);

  const handleMonthChange = (month) => {
    setCurrentMonth(MONTHS.indexOf(month));
    const newDate = new Date(calendarDate.setMonth(MONTHS.indexOf(month)));
    setCalendarDate(newDate);
  };

  const handleYearChange = (year) => {
    setCurrentYear(parseInt(year));
    const newDate = new Date(calendarDate.setFullYear(parseInt(year)));
    setCalendarDate(newDate);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(calendarDate.setMonth(calendarDate.getMonth() - 1));
    setCalendarDate(newDate);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleNextMonth = () => {
    const newDate = new Date(calendarDate.setMonth(calendarDate.getMonth() + 1));
    setCalendarDate(newDate);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleDateSelect = (date) => {
    if (activeInput === 'start') {
      setAbsenceStartDate(date);
    } else {
      setAbsenceEndDate(date);
    }
    setShowCalendar(false);
  };

  const handleRequestAbsence = async () => {
    if (!absenceType || !absenceStartDate || !absenceEndDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setAbsenceLoading(true);
    try {
      // Format dates for API
      const formattedStartDate = format(absenceStartDate, 'yyyy-MM-dd');
      const formattedEndDate = format(absenceEndDate, 'yyyy-MM-dd');

      const response = await fetch('/api/absences/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employee.id,
          type: absenceType,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          comment: absenceComment || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit absence request');
      }

      toast({
        title: "Success",
        description: "Absence request submitted successfully.",
      });

      // Reset form
      setAbsenceType('');
      setAbsenceStartDate(null);
      setAbsenceEndDate(null);
      setAbsenceComment('');
      setShowAbsenceModal(false);

      // Update leave requests list
      const updatedResponse = await fetch(`/api/absences/${employee.id}`);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setLeaveRequests(updatedData);
      }
    } catch (error) {
      console.error('Error submitting absence request:', error);
      toast({
        title: "Error",
        description: "Failed to submit absence request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAbsenceLoading(false);
    }
  };

  const handleRequestSubmit = async () => {
    try {
      const response = await fetch(`/api/absences/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data);
      }
    } catch (error) {
      console.error('Error updating leave requests:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!employee ? (
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Top Navigation Bar */}
              <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        onClick={() => navigate('/manager/employees')}
                        className="flex items-center space-x-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Employees</span>
                      </Button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" type="button" onClick={() => form.reset()}>Cancel</Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {employee ? `${employee.firstName} ${employee.surname}` : 'Employee Profile'}
                  </h1>
                </div>

                <div className="grid grid-cols-12 gap-8">
                  {/* Left Sidebar - Photo and Quick Info */}
                  <div className="col-span-12 lg:col-span-3">
                    <div className="space-y-6">
                      {/* Profile Photo Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Profile Photo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center space-y-4">
                            <div className="h-48 w-48 rounded-full overflow-hidden bg-gray-100">
                              {selectedImage ? (
                                <img src={selectedImage} alt="Profile" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Upload className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="max-w-xs"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Info Card */}
                      <QuickInfoCard 
                        department={employee.department}
                        position={employee.position}
                        location={employee.location}
                        startDate={employee.startDate}
                      />
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="col-span-12 lg:col-span-9">
                    <Card>
                      <CardContent className="p-6">
                        <Tabs defaultValue="profile" className="space-y-6">
                          <TabsList className="grid grid-cols-3 gap-4 bg-gray-100 p-1 rounded-lg">
                            <TabsTrigger value="profile" className="rounded-md py-2">Personal Info</TabsTrigger>
                            <TabsTrigger value="payroll" className="rounded-md py-2">Payroll</TabsTrigger>
                            <TabsTrigger value="leave" className="rounded-md py-2">Leave Management</TabsTrigger>
                          </TabsList>

                          <TabsContent value="profile">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Personal Information Section */}
                              <Card>
                                <CardHeader>
                                  <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                          <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="surname"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Surname</FormLabel>
                                        <FormControl>
                                          <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                          <Input {...field} type="email" className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                          <Textarea {...field} className="w-full min-h-[100px]" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </CardContent>
                              </Card>

                              {/* Emergency Contact Section */}
                              <Card>
                                <CardHeader>
                                  <CardTitle>Emergency Contact</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <FormField
                                    control={form.control}
                                    name="emergencyContactName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Contact Name</FormLabel>
                                        <FormControl>
                                          <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="emergencyContactRelation"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Relationship</FormLabel>
                                        <FormControl>
                                          <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="emergencyContactPhone"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                          <Input {...field} type="tel" className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          <TabsContent value="payroll">
                            <div className="grid grid-cols-1 gap-8">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Payroll Information</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField
                                    control={form.control}
                                    name="grossSalary"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Gross Salary</FormLabel>
                                        <FormControl>
                                          <Input {...field} type="number" className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="tinNumber"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>TIN Number</FormLabel>
                                        <FormControl>
                                          <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="bankName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Bank Name</FormLabel>
                                        <FormControl>
                                          <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="accountNumber"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <FormControl>
                                          <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          <TabsContent value="leave">
                            <div className="grid grid-cols-1 gap-8">
                              <div className="space-y-6">
                                <LeaveBalanceCard leaveBalance={employee?.leaveBalance || []} />
                                <LeaveCalendar 
                                  leaveRequests={leaveRequests}
                                  absenceStartDate={absenceStartDate}
                                  setAbsenceStartDate={setAbsenceStartDate}
                                  absenceEndDate={absenceEndDate}
                                  setAbsenceEndDate={setAbsenceEndDate}
                                />
                                <LeaveRequestDialog 
                                  employee={employee} 
                                  onRequestSubmit={handleRequestSubmit}
                                />
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default EditEmployeeProfile;
