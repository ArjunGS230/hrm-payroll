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

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveServiceImpl implements LeaveService {


    private final LeaveApplicationRepository leaveApplicationRepository;

    private final EmployeeRepository employeeRepository;

    private final LeaveBalanceRepository leaveBalanceRepository;


    // =====================================================
    // APPLY LEAVE
    // =====================================================

    @Override
    public LeaveResponse applyLeave(
            LeaveRequest request) {

        if (request == null) {

            throw new BadRequestException(
                    "Leave request cannot be null"
            );
        }


        // -------------------------------------------------
        // FIND EMPLOYEE
        // -------------------------------------------------

        Employee employee =
                employeeRepository
                        .findById(
                                request.getEmployeeId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + request.getEmployeeId()
                                )
                        );


        // -------------------------------------------------
        // CHECK EMPLOYEE ACTIVE
        // -------------------------------------------------

        if (!employee.isActive()) {

            throw new BadRequestException(
                    "Inactive employees cannot apply for leave"
            );
        }


        // -------------------------------------------------
        // VALIDATE DATES
        // -------------------------------------------------

        LocalDate startDate =
                request.getStartDate();

        LocalDate endDate =
                request.getEndDate();


        if (startDate == null ||
                endDate == null) {

            throw new BadRequestException(
                    "Start date and end date are required"
            );
        }


        if (endDate.isBefore(startDate)) {

            throw new BadRequestException(
                    "End date cannot be before start date"
            );
        }


        // -------------------------------------------------
        // CALCULATE NUMBER OF DAYS
        // -------------------------------------------------

        int numberOfDays =
                (int) (
                        endDate.toEpochDay()
                                -
                        startDate.toEpochDay()
                                + 1
                );


        if (numberOfDays <= 0) {

            throw new BadRequestException(
                    "Number of leave days must be greater than zero"
            );
        }


        // -------------------------------------------------
        // NORMALIZE LEAVE TYPE
        // -------------------------------------------------

        String leaveType =
                normalizeLeaveType(
                        request.getLeaveType()
                );


        // -------------------------------------------------
        // GET OR CREATE LEAVE BALANCE
        // -------------------------------------------------

        LeaveBalance balance =
                getOrCreateLeaveBalance(
                        employee
                );


        // -------------------------------------------------
        // CHECK AVAILABLE BALANCE
        //
        // Balance is NOT deducted here.
        // It is deducted only when HR approves.
        // -------------------------------------------------

        int availableBalance =
                getAvailableBalance(
                        balance,
                        leaveType
                );


        if (numberOfDays > availableBalance) {

            throw new BadRequestException(
                    "Insufficient "
                            + getDisplayLeaveType(
                                    leaveType
                            )
                            + " leave balance. Available: "
                            + availableBalance
            );
        }


        // -------------------------------------------------
        // CREATE LEAVE APPLICATION
        // -------------------------------------------------

        LeaveApplication leaveApplication =
                LeaveApplication.builder()

                        .employee(
                                employee
                        )

                        .leaveType(
                                leaveType
                        )

                        .startDate(
                                startDate
                        )

                        .endDate(
                                endDate
                        )

                        .numberOfDays(
                                numberOfDays
                        )

                        .status(
                                "PENDING"
                        )

                        .reason(
                                request.getReason()
                        )

                        .build();


        // -------------------------------------------------
        // SAVE
        // -------------------------------------------------

        LeaveApplication saved =
                leaveApplicationRepository.save(
                        leaveApplication
                );


        return mapToResponse(
                saved
        );
    }


    // =====================================================
    // GET LEAVE BALANCE
    // =====================================================

    @Override
    public LeaveBalanceResponse getLeaveBalance(
            Long employeeId) {

        if (employeeId == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        // -------------------------------------------------
        // FIND EMPLOYEE
        // -------------------------------------------------

        Employee employee =
                employeeRepository
                        .findById(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + employeeId
                                )
                        );


        // -------------------------------------------------
        // GET OR CREATE BALANCE
        // -------------------------------------------------

        LeaveBalance balance =
                getOrCreateLeaveBalance(
                        employee
                );


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

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


    // =====================================================
    // GET EMPLOYEE LEAVES
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getEmployeeLeaves(
            Long employeeId) {

        if (employeeId == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        // -------------------------------------------------
        // CHECK EMPLOYEE
        // -------------------------------------------------

        employeeRepository
                .findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: "
                                        + employeeId
                        )
                );


        // -------------------------------------------------
        // GET LEAVES
        // -------------------------------------------------

        return leaveApplicationRepository
                .findByEmployeeId(
                        employeeId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET PENDING LEAVES
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getPendingLeaves() {

        return leaveApplicationRepository
                .findByStatus(
                        "PENDING"
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // APPROVE LEAVE
    // =====================================================

    @Override
    public LeaveResponse approveLeave(
            Long leaveId) {

        if (leaveId == null) {

            throw new BadRequestException(
                    "Leave ID is required"
            );
        }


        // -------------------------------------------------
        // FIND LEAVE APPLICATION
        // -------------------------------------------------

        LeaveApplication leaveApplication =
                leaveApplicationRepository
                        .findById(leaveId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave application not found with id: "
                                                + leaveId
                                )
                        );


        // -------------------------------------------------
        // CHECK STATUS
        // -------------------------------------------------

        if (!"PENDING".equalsIgnoreCase(
                leaveApplication.getStatus()
        )) {

            throw new BadRequestException(
                    "Only pending leave applications can be approved"
            );
        }


        // -------------------------------------------------
        // GET EMPLOYEE
        // -------------------------------------------------

        Employee employee =
                leaveApplication.getEmployee();


        // -------------------------------------------------
        // GET BALANCE
        // -------------------------------------------------

        LeaveBalance balance =
                getOrCreateLeaveBalance(
                        employee
                );


        // -------------------------------------------------
        // NORMALIZE LEAVE TYPE
        //
        // This is important because old records may contain
        // CL / SL / EL OR full names.
        // -------------------------------------------------

        String leaveType =
                normalizeLeaveType(
                        leaveApplication.getLeaveType()
                );


        int numberOfDays =
                leaveApplication.getNumberOfDays();


        // -------------------------------------------------
        // CHECK AND DEDUCT BALANCE
        // -------------------------------------------------

        switch (leaveType) {


            // -------------------------------------------------
            // CASUAL LEAVE
            // -------------------------------------------------

            case "CL":

                if (numberOfDays >
                        balance.getCasualLeave()) {

                    throw new BadRequestException(
                            "Insufficient casual leave balance"
                    );
                }


                balance.setCasualLeave(
                        balance.getCasualLeave()
                                - numberOfDays
                );

                break;


            // -------------------------------------------------
            // SICK LEAVE
            // -------------------------------------------------

            case "SL":

                if (numberOfDays >
                        balance.getSickLeave()) {

                    throw new BadRequestException(
                            "Insufficient sick leave balance"
                    );
                }


                balance.setSickLeave(
                        balance.getSickLeave()
                                - numberOfDays
                );

                break;


            // -------------------------------------------------
            // EARNED LEAVE
            // -------------------------------------------------

            case "EL":

                if (numberOfDays >
                        balance.getEarnedLeave()) {

                    throw new BadRequestException(
                            "Insufficient earned leave balance"
                    );
                }


                balance.setEarnedLeave(
                        balance.getEarnedLeave()
                                - numberOfDays
                );

                break;


            default:

                throw new BadRequestException(
                        "Invalid leave type: "
                                + leaveType
                );
        }


        // -------------------------------------------------
        // SAVE UPDATED BALANCE
        // -------------------------------------------------

        leaveBalanceRepository.save(
                balance
        );


        // -------------------------------------------------
        // APPROVE APPLICATION
        // -------------------------------------------------

        leaveApplication.setLeaveType(
                leaveType
        );

        leaveApplication.setStatus(
                "APPROVED"
        );


        LeaveApplication updated =
                leaveApplicationRepository.save(
                        leaveApplication
                );


        return mapToResponse(
                updated
        );
    }


    // =====================================================
    // REJECT LEAVE
    // =====================================================

    @Override
    public LeaveResponse rejectLeave(
            Long leaveId) {

        if (leaveId == null) {

            throw new BadRequestException(
                    "Leave ID is required"
            );
        }


        // -------------------------------------------------
        // FIND APPLICATION
        // -------------------------------------------------

        LeaveApplication leaveApplication =
                leaveApplicationRepository
                        .findById(leaveId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave application not found with id: "
                                                + leaveId
                        )
                );


        // -------------------------------------------------
        // CHECK STATUS
        // -------------------------------------------------

        if (!"PENDING".equalsIgnoreCase(
                leaveApplication.getStatus()
        )) {

            throw new BadRequestException(
                    "Only pending leave applications can be rejected"
            );
        }


        // -------------------------------------------------
        // REJECT
        // -------------------------------------------------

        leaveApplication.setStatus(
                "REJECTED"
        );


        LeaveApplication updated =
                leaveApplicationRepository.save(
                        leaveApplication
                );


        return mapToResponse(
                updated
        );
    }


    // =====================================================
    // GET OR CREATE LEAVE BALANCE
    // =====================================================

    private LeaveBalance getOrCreateLeaveBalance(
            Employee employee) {

        return leaveBalanceRepository

                .findByEmployee(
                        employee
                )

                .orElseGet(() -> {

                    LeaveBalance balance =
                            LeaveBalance.builder()

                                    .employee(
                                            employee
                                    )

                                    .casualLeave(
                                            12
                                    )

                                    .sickLeave(
                                            12
                                    )

                                    .earnedLeave(
                                            15
                                    )

                                    .build();


                    return leaveBalanceRepository.save(
                            balance
                    );
                });
    }


    // =====================================================
    // NORMALIZE LEAVE TYPE
    // =====================================================

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


        switch (type) {


            // -------------------------------------------------
            // CASUAL
            // -------------------------------------------------

            case "CL":
            case "CASUAL":
            case "CASUAL_LEAVE":

                return "CL";


            // -------------------------------------------------
            // SICK
            // -------------------------------------------------

            case "SL":
            case "SICK":
            case "SICK_LEAVE":

                return "SL";


            // -------------------------------------------------
            // EARNED
            // -------------------------------------------------

            case "EL":
            case "EARNED":
            case "EARNED_LEAVE":

                return "EL";


            // -------------------------------------------------
            // INVALID
            // -------------------------------------------------

            default:

                throw new BadRequestException(
                        "Invalid leave type: "
                                + leaveType
                );
        }
    }


    // =====================================================
    // GET AVAILABLE BALANCE
    // =====================================================

    private int getAvailableBalance(
            LeaveBalance balance,
            String leaveType) {

        switch (leaveType) {

            case "CL":

                return balance.getCasualLeave();


            case "SL":

                return balance.getSickLeave();


            case "EL":

                return balance.getEarnedLeave();


            default:

                throw new BadRequestException(
                        "Invalid leave type: "
                                + leaveType
                );
        }
    }


    // =====================================================
    // DISPLAY LEAVE TYPE
    // =====================================================

    private String getDisplayLeaveType(
            String leaveType) {

        switch (leaveType) {

            case "CL":

                return "Casual";


            case "SL":

                return "Sick";


            case "EL":

                return "Earned";


            default:

                return leaveType;
        }
    }


    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private LeaveResponse mapToResponse(
            LeaveApplication leaveApplication) {

        Employee employee =
                leaveApplication.getEmployee();


        return LeaveResponse.builder()

                .id(
                        leaveApplication.getId()
                )

                .employeeId(
                        employee.getId()
                )

                .employeeName(
                        employee.getName()
                )

                .leaveType(
                        leaveApplication.getLeaveType()
                )

                .startDate(
                        leaveApplication.getStartDate()
                )

                .endDate(
                        leaveApplication.getEndDate()
                )

                .numberOfDays(
                        leaveApplication.getNumberOfDays()
                )

                .status(
                        leaveApplication.getStatus()
                )

                .reason(
                        leaveApplication.getReason()
                )

                .build();
    }
}