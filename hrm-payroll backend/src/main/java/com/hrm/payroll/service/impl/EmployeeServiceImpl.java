package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.EmployeeRequest;
import com.hrm.payroll.dto.EmployeeResponse;

import com.hrm.payroll.entity.AccountStatus;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.EmployeeStatus;
import com.hrm.payroll.entity.LeaveBalance;
import com.hrm.payroll.entity.User;

import com.hrm.payroll.exception.BadRequestException;
import com.hrm.payroll.exception.DuplicateResourceException;
import com.hrm.payroll.exception.ResourceNotFoundException;

import com.hrm.payroll.repository.EmployeeRepository;
import com.hrm.payroll.repository.LeaveBalanceRepository;
import com.hrm.payroll.repository.UserRepository;

import com.hrm.payroll.service.EmployeeService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl
        implements EmployeeService {


    private final EmployeeRepository employeeRepository;

    private final LeaveBalanceRepository leaveBalanceRepository;

    private final UserRepository userRepository;


    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    @Override
    public EmployeeResponse createEmployee(
            EmployeeRequest request) {

        if (request == null) {

            throw new BadRequestException(
                    "Employee request cannot be null"
            );
        }


        // -----------------------------------------------------
        // VALIDATE NAME
        // -----------------------------------------------------

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new BadRequestException(
                    "Employee name is required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new BadRequestException(
                    "Employee email is required"
            );
        }


        // -----------------------------------------------------
        // CHECK EMAIL
        // -----------------------------------------------------

        if (employeeRepository
                .findByEmail(
                        request.getEmail()
                )
                .isPresent()) {

            throw new DuplicateResourceException(
                    "Email already exists: "
                            + request.getEmail()
            );
        }


        // -----------------------------------------------------
        // GENERATE EMPLOYEE CODE
        // -----------------------------------------------------

        String employeeCode =
                generateEmployeeCode();


        // -----------------------------------------------------
        // CREATE EMPLOYEE
        //
        // HR manually creates employee,
        // so employee is approved immediately.
        // -----------------------------------------------------

        Employee employee =
                Employee.builder()

                        .employeeCode(
                                employeeCode
                        )

                        .name(
                                request.getName()
                        )

                        .email(
                                request.getEmail()
                        )

                        .department(
                                request.getDepartment()
                        )

                        .designation(
                                request.getDesignation()
                        )

                        .joiningDate(
                                request.getJoiningDate()
                        )

                        .active(true)

                        .status(
                                EmployeeStatus.APPROVED
                        )

                        .build();


        // -----------------------------------------------------
        // SAVE EMPLOYEE
        // -----------------------------------------------------

        Employee savedEmployee =
                employeeRepository.save(
                        employee
                );


        // -----------------------------------------------------
        // CREATE DEFAULT LEAVE BALANCE
        //
        // Casual = 12
        // Sick   = 12
        // Earned = 15
        // -----------------------------------------------------

        LeaveBalance leaveBalance =
                LeaveBalance.builder()

                        .employee(
                                savedEmployee
                        )

                        .casualLeave(12)

                        .sickLeave(12)

                        .earnedLeave(15)

                        .build();


        leaveBalanceRepository.save(
                leaveBalance
        );


        return mapToResponse(
                savedEmployee
        );
    }


    // =========================================================
    // GENERATE EMPLOYEE CODE
    // =========================================================

    private String generateEmployeeCode() {

        long nextNumber =
                employeeRepository.count() + 1;


        String employeeCode;


        do {

            employeeCode =
                    String.format(
                            "HRMEMP%03d",
                            nextNumber
                    );


            nextNumber++;

        } while (
                employeeRepository
                        .findByEmployeeCode(
                                employeeCode
                        )
                        .isPresent()
        );


        return employeeCode;
    }


    // =========================================================
    // APPROVE EMPLOYEE
    // =========================================================

    @Override
    public EmployeeResponse approveEmployee(
            Long id) {

        if (id == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        Employee employee =
                employeeRepository.findById(id)

                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // VALIDATE REQUIRED HR DETAILS
        // -----------------------------------------------------

        if (employee.getDepartment() == null ||
                employee.getDepartment().trim().isEmpty() ||
                employee.getDepartment()
                        .equalsIgnoreCase("Not Assigned")) {

            throw new BadRequestException(
                    "Department must be assigned before approval"
            );
        }


        if (employee.getDesignation() == null ||
                employee.getDesignation().trim().isEmpty() ||
                employee.getDesignation()
                        .equalsIgnoreCase("Not Assigned")) {

            throw new BadRequestException(
                    "Designation must be assigned before approval"
            );
        }


        if (employee.getJoiningDate() == null) {

            throw new BadRequestException(
                    "Joining date must be assigned before approval"
            );
        }


        // -----------------------------------------------------
        // FIND USER ACCOUNT
        // -----------------------------------------------------

        User user =
                userRepository.findByEmail(
                        employee.getEmail()
                )

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User account not found for employee: "
                                        + employee.getEmail()
                        )
                );


        // -----------------------------------------------------
        // APPROVE EMPLOYEE
        // -----------------------------------------------------

        employee.setActive(true);

        employee.setStatus(
                EmployeeStatus.APPROVED
        );


        // -----------------------------------------------------
        // APPROVE USER ACCOUNT
        // -----------------------------------------------------

        user.setStatus(
                AccountStatus.APPROVED
        );

        user.setActive(true);


        // -----------------------------------------------------
        // SAVE EMPLOYEE
        // -----------------------------------------------------

        employeeRepository.save(
                employee
        );


        // -----------------------------------------------------
        // SAVE USER
        // -----------------------------------------------------

        userRepository.save(
                user
        );


        // -----------------------------------------------------
        // CREATE LEAVE BALANCE IF MISSING
        // -----------------------------------------------------

        boolean leaveBalanceExists =
                leaveBalanceRepository
                        .findByEmployeeId(
                                employee.getId()
                        )
                        .isPresent();


        if (!leaveBalanceExists) {

            LeaveBalance leaveBalance =
                    LeaveBalance.builder()

                            .employee(
                                    employee
                            )

                            .casualLeave(12)

                            .sickLeave(12)

                            .earnedLeave(15)

                            .build();


            leaveBalanceRepository.save(
                    leaveBalance
            );
        }


        return mapToResponse(
                employee
        );
    }


    // =========================================================
    // REJECT EMPLOYEE
    // =========================================================

    @Override
    public EmployeeResponse rejectEmployee(
            Long id) {

        if (id == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        Employee employee =
                employeeRepository.findById(id)

                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // FIND USER ACCOUNT
        // -----------------------------------------------------

        User user =
                userRepository.findByEmail(
                        employee.getEmail()
                )

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User account not found for employee: "
                                        + employee.getEmail()
                        )
                );


        // -----------------------------------------------------
        // REJECT EMPLOYEE
        // -----------------------------------------------------

        employee.setActive(false);

        employee.setStatus(
                EmployeeStatus.REJECTED
        );


        // -----------------------------------------------------
        // REJECT USER
        // -----------------------------------------------------

        user.setStatus(
                AccountStatus.REJECTED
        );

        user.setActive(false);


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        employeeRepository.save(
                employee
        );

        userRepository.save(
                user
        );


        return mapToResponse(
                employee
        );
    }


    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {

        return employeeRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET EMPLOYEE BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(
            Long id) {

        if (id == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        Employee employee =
                employeeRepository.findById(id)

                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );


        return mapToResponse(
                employee
        );
    }


    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    @Override
    public EmployeeResponse updateEmployee(
            Long id,
            EmployeeRequest request) {

        if (id == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        if (request == null) {

            throw new BadRequestException(
                    "Employee request cannot be null"
            );
        }


        // -----------------------------------------------------
        // FIND EMPLOYEE
        // -----------------------------------------------------

        Employee employee =
                employeeRepository.findById(id)

                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // CHECK EMAIL
        // -----------------------------------------------------

        employeeRepository
                .findByEmail(
                        request.getEmail()
                )
                .ifPresent(existingEmployee -> {

                    if (!existingEmployee
                            .getId()
                            .equals(id)) {

                        throw new DuplicateResourceException(
                                "Email already exists: "
                                        + request.getEmail()
                        );
                    }
                });


        // -----------------------------------------------------
        // UPDATE DETAILS
        // -----------------------------------------------------

        employee.setName(
                request.getName()
        );

        employee.setEmail(
                request.getEmail()
        );

        employee.setDepartment(
                request.getDepartment()
        );

        employee.setDesignation(
                request.getDesignation()
        );

        employee.setJoiningDate(
                request.getJoiningDate()
        );


        // -----------------------------------------------------
        // DO NOT CHANGE EMPLOYEE CODE
        // -----------------------------------------------------

        // Employee code is generated by backend and remains
        // unchanged throughout the employee lifecycle.


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        Employee updatedEmployee =
                employeeRepository.save(
                        employee
                );


        return mapToResponse(
                updatedEmployee
        );
    }


    // =========================================================
    // DELETE / DEACTIVATE EMPLOYEE
    // =========================================================

    @Override
    public void deleteEmployee(Long id) {

        if (id == null) {
            throw new BadRequestException(
                    "Employee ID is required"
            );
        }

        Employee employee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );

        // -----------------------------------------------------
        // DEACTIVATE EMPLOYEE
        // -----------------------------------------------------

        employee.setActive(false);

        employeeRepository.save(employee);

        // -----------------------------------------------------
        // DEACTIVATE USER ACCOUNT
        // -----------------------------------------------------

        userRepository.findByEmail(
                employee.getEmail()
        ).ifPresent(user -> {

            user.setActive(false);

            userRepository.save(user);
        });
    }

    // =========================================================
    // REACTIVATE EMPLOYEE
    // =========================================================
    @Override
    public EmployeeResponse reactivateEmployee(Long id) {

        if (id == null) {
            throw new BadRequestException(
                    "Employee ID is required"
            );
        }

        Employee employee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );

        // -----------------------------------------------------
        // REACTIVATE EMPLOYEE
        // -----------------------------------------------------

        employee.setActive(true);

        employee.setStatus(
                EmployeeStatus.APPROVED
        );

        // -----------------------------------------------------
        // REACTIVATE USER ACCOUNT
        // -----------------------------------------------------

        userRepository.findByEmail(
                employee.getEmail()
        ).ifPresent(user -> {

            user.setActive(true);

            user.setStatus(
                    AccountStatus.APPROVED
            );

            userRepository.save(user);
        });

        // -----------------------------------------------------
        // SAVE EMPLOYEE
        // -----------------------------------------------------

        Employee updatedEmployee =
                employeeRepository.save(employee);

        return mapToResponse(
                updatedEmployee
        );
    }

    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private EmployeeResponse mapToResponse(
            Employee employee) {

        return EmployeeResponse.builder()

                .id(
                        employee.getId()
                )

                .employeeCode(
                        employee.getEmployeeCode()
                )

                .name(
                        employee.getName()
                )

                .email(
                        employee.getEmail()
                )

                .department(
                        employee.getDepartment()
                )

                .designation(
                        employee.getDesignation()
                )

                .joiningDate(
                        employee.getJoiningDate()
                )

                .active(
                        employee.isActive()
                )

                .status(
                        employee.getStatus()
                )

                .build();
    }
}