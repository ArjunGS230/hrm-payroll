package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.LeaveBalanceResponse;
import com.hrm.payroll.dto.LeaveRequest;
import com.hrm.payroll.dto.LeaveResponse;

import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.LeaveApplication;
import com.hrm.payroll.entity.LeaveBalance;

import com.hrm.payroll.exception.BadRequestException;
import com.hrm.payroll.exception.ResourceNotFoundException;

import com.hrm.payroll.repository.EmployeeRepository;
import com.hrm.payroll.repository.LeaveApplicationRepository;
import com.hrm.payroll.repository.LeaveBalanceRepository;

import com.hrm.payroll.service.LeaveService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveServiceImpl implements LeaveService {

    private final EmployeeRepository employeeRepository;

    private final LeaveBalanceRepository leaveBalanceRepository;

    private final LeaveApplicationRepository leaveApplicationRepository;


    // =========================================================
    // APPLY LEAVE
    // =========================================================

    @Override
    public LeaveResponse applyLeave(
            LeaveRequest request) {

        // Validate request

        if (request == null) {

            throw new BadRequestException(
                    "Leave request cannot be null"
            );
        }

        if (request.getEmployeeId() == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }

        if (request.getLeaveType() == null ||
                request.getLeaveType().trim().isEmpty()) {

            throw new BadRequestException(
                    "Leave type is required"
            );
        }

        if (request.getStartDate() == null ||
                request.getEndDate() == null) {

            throw new BadRequestException(
                    "Start date and end date are required"
            );
        }


        // =====================================================
        // FIND EMPLOYEE
        // =====================================================

        Employee employee =
                employeeRepository.findById(
                        request.getEmployeeId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: "
                                        + request.getEmployeeId()
                        )
                );


        // =====================================================
        // CHECK ACTIVE EMPLOYEE
        // =====================================================

        if (!employee.isActive()) {

            throw new BadRequestException(
                    "Inactive employee cannot apply for leave"
            );
        }


        // =====================================================
        // VALIDATE DATES
        // =====================================================

        if (request.getEndDate()
                .isBefore(request.getStartDate())) {

            throw new BadRequestException(
                    "End date cannot be before start date"
            );
        }


        // =====================================================
        // NORMALIZE LEAVE TYPE
        // =====================================================

        String leaveType =
                normalizeLeaveType(
                        request.getLeaveType()
                );


        // =====================================================
        // CALCULATE NUMBER OF DAYS
        // =====================================================

        int numberOfDays =
                (int) ChronoUnit.DAYS.between(
                        request.getStartDate(),
                        request.getEndDate()
                ) + 1;


        if (numberOfDays <= 0) {

            throw new BadRequestException(
                    "Leave duration must be greater than zero"
            );
        }


        // =====================================================
        // FIND LEAVE BALANCE
        // =====================================================

        LeaveBalance balance =
                leaveBalanceRepository
                        .findByEmployeeId(
                                employee.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave balance not found "
                                                + "for employee: "
                                                + employee.getId()
                                )
                        );


        // =====================================================
        // CHECK AVAILABLE BALANCE
        // =====================================================

        int availableBalance =
                getBalanceByType(
                        balance,
                        leaveType
                );


        if (numberOfDays > availableBalance) {

            throw new BadRequestException(
                    "Insufficient leave balance. "
                            + "Available: "
                            + availableBalance
                            + ", Requested: "
                            + numberOfDays
            );
        }


        // =====================================================
        // CREATE LEAVE APPLICATION
        // =====================================================

        LeaveApplication application =
                LeaveApplication.builder()
                        .employee(employee)
                        .leaveType(leaveType)
                        .startDate(
                                request.getStartDate()
                        )
                        .endDate(
                                request.getEndDate()
                        )
                        .numberOfDays(numberOfDays)
                        .status("PENDING")
                        .reason(request.getReason())
                        .build();


        LeaveApplication saved =
                leaveApplicationRepository.save(
                        application
                );


        return mapToResponse(saved);
    }


    // =========================================================
    // NORMALIZE LEAVE TYPE
    // =========================================================

    private String normalizeLeaveType(
            String leaveType) {

        if (leaveType == null ||
                leaveType.trim().isEmpty()) {

            throw new BadRequestException(
                    "Leave type is required"
            );
        }


        String type =
                leaveType
                        .trim()
                        .toUpperCase();


        return switch (type) {

            // Casual Leave

            case "CL",
                 "CASUAL",
                 "CASUAL LEAVE" -> "CL";


            // Sick Leave

            case "SL",
                 "SICK",
                 "SICK LEAVE" -> "SL";


            // Earned Leave

            case "EL",
                 "EARNED",
                 "EARNED LEAVE" -> "EL";


            // Invalid

            default ->
                    throw new BadRequestException(
                            "Invalid leave type. Use "
                                    + "CL/Casual Leave, "
                                    + "SL/Sick Leave, or "
                                    + "EL/Earned Leave"
                    );
        };
    }


    // =========================================================
    // GET LEAVE BALANCE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public LeaveBalanceResponse getLeaveBalance(
            Long employeeId) {

        if (employeeId == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        Employee employee =
                employeeRepository.findById(
                        employeeId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: "
                                        + employeeId
                        )
                );


        LeaveBalance balance =
                leaveBalanceRepository
                        .findByEmployeeId(
                                employeeId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave balance not found "
                                                + "for employee: "
                                                + employeeId
                                )
                        );


        return LeaveBalanceResponse.builder()

                .employeeId(
                        employee.getId()
                )

                .employeeName(
                        employee.getName()
                )

                .casualLeave(
                        balance.getCasualLeave()
                )

                .sickLeave(
                        balance.getSickLeave()
                )

                .earnedLeave(
                        balance.getEarnedLeave()
                )

                .build();
    }


    // =========================================================
    // GET EMPLOYEE LEAVES
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getEmployeeLeaves(
            Long employeeId) {

        if (employeeId == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        if (!employeeRepository.existsById(
                employeeId)) {

            throw new ResourceNotFoundException(
                    "Employee not found with id: "
                            + employeeId
            );
        }


        return leaveApplicationRepository
                .findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET PENDING LEAVES
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getPendingLeaves() {

        return leaveApplicationRepository
                .findByStatus("PENDING")
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // APPROVE LEAVE
    // =========================================================

    @Override
    public LeaveResponse approveLeave(
            Long leaveId) {

        if (leaveId == null) {

            throw new BadRequestException(
                    "Leave ID is required"
            );
        }


        LeaveApplication application =
                leaveApplicationRepository
                        .findById(leaveId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave application not found "
                                                + "with id: "
                                                + leaveId
                                )
                        );


        // Only pending leave can be approved

        if (!"PENDING".equals(
                application.getStatus())) {

            throw new BadRequestException(
                    "Only pending leave can be approved"
            );
        }


        Employee employee =
                application.getEmployee();


        if (employee == null) {

            throw new ResourceNotFoundException(
                    "Employee not found for leave application: "
                            + leaveId
            );
        }


        LeaveBalance balance =
                leaveBalanceRepository
                        .findByEmployeeId(
                                employee.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave balance not found "
                                                + "for employee: "
                                                + employee.getId()
                                )
                        );


        int available =
                getBalanceByType(
                        balance,
                        application.getLeaveType()
                );


        if (application.getNumberOfDays()
                > available) {

            throw new BadRequestException(
                    "Insufficient leave balance. "
                            + "Available: "
                            + available
                            + ", Requested: "
                            + application.getNumberOfDays()
            );
        }


        // Deduct leave balance

        deductBalance(
                balance,
                application.getLeaveType(),
                application.getNumberOfDays()
        );


        // Approve application

        application.setStatus("APPROVED");


        leaveBalanceRepository.save(
                balance
        );


        LeaveApplication saved =
                leaveApplicationRepository.save(
                        application
                );


        return mapToResponse(saved);
    }


    // =========================================================
    // REJECT LEAVE
    // =========================================================

    @Override
    public LeaveResponse rejectLeave(
            Long leaveId) {

        if (leaveId == null) {

            throw new BadRequestException(
                    "Leave ID is required"
            );
        }


        LeaveApplication application =
                leaveApplicationRepository
                        .findById(leaveId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave application not found "
                                                + "with id: "
                                                + leaveId
                                )
                        );


        // Only pending leave can be rejected

        if (!"PENDING".equals(
                application.getStatus())) {

            throw new BadRequestException(
                    "Only pending leave can be rejected"
            );
        }


        application.setStatus(
                "REJECTED"
        );


        LeaveApplication saved =
                leaveApplicationRepository.save(
                        application
                );


        return mapToResponse(saved);
    }


    // =========================================================
    // GET BALANCE BY TYPE
    // =========================================================

    private int getBalanceByType(
            LeaveBalance balance,
            String leaveType) {

        if (balance == null) {

            throw new ResourceNotFoundException(
                    "Leave balance not found"
            );
        }


        return switch (leaveType) {

            case "CL" ->
                    balance.getCasualLeave();

            case "SL" ->
                    balance.getSickLeave();

            case "EL" ->
                    balance.getEarnedLeave();

            default ->
                    throw new BadRequestException(
                            "Invalid leave type. "
                                    + "Use CL, SL or EL"
                    );
        };
    }


    // =========================================================
    // DEDUCT BALANCE
    // =========================================================

    private void deductBalance(
            LeaveBalance balance,
            String leaveType,
            int days) {

        if (days <= 0) {

            throw new BadRequestException(
                    "Leave days must be greater than zero"
            );
        }


        switch (leaveType) {

            // Casual Leave

            case "CL" -> {

                int remaining =
                        balance.getCasualLeave()
                                - days;


                if (remaining < 0) {

                    throw new BadRequestException(
                            "Casual leave balance cannot "
                                    + "be negative"
                    );
                }


                balance.setCasualLeave(
                        remaining
                );
            }


            // Sick Leave

            case "SL" -> {

                int remaining =
                        balance.getSickLeave()
                                - days;


                if (remaining < 0) {

                    throw new BadRequestException(
                            "Sick leave balance cannot "
                                    + "be negative"
                    );
                }


                balance.setSickLeave(
                        remaining
                );
            }


            // Earned Leave

            case "EL" -> {

                int remaining =
                        balance.getEarnedLeave()
                                - days;


                if (remaining < 0) {

                    throw new BadRequestException(
                            "Earned leave balance cannot "
                                    + "be negative"
                    );
                }


                balance.setEarnedLeave(
                        remaining
                );
            }


            default ->
                    throw new BadRequestException(
                            "Invalid leave type. "
                                    + "Use CL, SL or EL"
                    );
        }
    }


    // =========================================================
    // MAP ENTITY → RESPONSE
    // =========================================================

    private LeaveResponse mapToResponse(
            LeaveApplication application) {

        return LeaveResponse.builder()

                .id(
                        application.getId()
                )

                .employeeId(
                        application
                                .getEmployee()
                                .getId()
                )

                .employeeName(
                        application
                                .getEmployee()
                                .getName()
                )

                .leaveType(
                        application
                                .getLeaveType()
                )

                .startDate(
                        application
                                .getStartDate()
                )

                .endDate(
                        application
                                .getEndDate()
                )

                .numberOfDays(
                        application
                                .getNumberOfDays()
                )

                .status(
                        application
                                .getStatus()
                )

                .reason(
                        application
                                .getReason()
                )

                .build();
    }
}