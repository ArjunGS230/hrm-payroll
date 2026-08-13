package com.hrm.payroll.service;

import com.hrm.payroll.dto.LeaveBalanceResponse;
import com.hrm.payroll.dto.LeaveRequest;
import com.hrm.payroll.dto.LeaveResponse;

import java.util.List;

public interface LeaveService {

    LeaveResponse applyLeave(LeaveRequest request);

    LeaveBalanceResponse getLeaveBalance(Long employeeId);

    List<LeaveResponse> getEmployeeLeaves(Long employeeId);

    List<LeaveResponse> getPendingLeaves();

    LeaveResponse approveLeave(Long leaveId);

    LeaveResponse rejectLeave(Long leaveId);
}