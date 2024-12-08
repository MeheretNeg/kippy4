import express from 'express';
const router = express.Router();

// In-memory storage for leave requests
const leaveRequests = new Map();

// Request absence
router.post('/request', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    const { employeeId, type, startDate, endDate, comment } = req.body;
    
    const newRequest = {
      id: Date.now(),
      employeeId,
      type,
      startDate,
      endDate,
      comment,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Store the request
    if (!leaveRequests.has(employeeId)) {
      leaveRequests.set(employeeId, []);
    }
    leaveRequests.get(employeeId).push(newRequest);
    
    console.log('Stored request:', newRequest);
    res.json({
      success: true,
      message: 'Absence request submitted successfully',
      data: newRequest
    });
  } catch (error) {
    console.error('Error in /request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit absence request',
      error: error.message
    });
  }
});

// Get leave requests for an employee
router.get('/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log('Fetching requests for employee:', employeeId);
    
    const employeeRequests = leaveRequests.get(employeeId) || [];
    console.log('Found requests:', employeeRequests);
    
    res.json({
      success: true,
      data: employeeRequests
    });
  } catch (error) {
    console.error('Error in GET /:employeeId:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave requests',
      error: error.message
    });
  }
});

// Skip approval absence
router.post('/skip-approval', async (req, res) => {
  try {
    console.log('Received skip approval request:', req.body);
    const { employeeId, type, startDate, endDate, comment } = req.body;
    
    const newRequest = {
      id: Date.now(),
      employeeId,
      type,
      startDate,
      endDate,
      comment,
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    // Store the request
    if (!leaveRequests.has(employeeId)) {
      leaveRequests.set(employeeId, []);
    }
    leaveRequests.get(employeeId).push(newRequest);
    
    console.log('Stored approved request:', newRequest);
    res.json({
      success: true,
      message: 'Absence request approved successfully',
      data: newRequest
    });
  } catch (error) {
    console.error('Error in /skip-approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process absence request',
      error: error.message
    });
  }
});

export const absencesRouter = router;
