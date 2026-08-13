package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.EmployeeRequest;
import com.hrm.payroll.dto.EmployeeResponse;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.LeaveBalance;
import com.hrm.payroll.exception.BadRequestException;
import com.hrm.payroll.exception.DuplicateResourceException;
import com.hrm.payroll.exception.ResourceNotFoundException;
import com.hrm.payroll.repository.EmployeeRepository;
import com.hrm.payroll.repository.LeaveBalanceRepository;
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

        if (request.getEmployeeCode() == null ||
                request.getEmployeeCode().trim().isEmpty()) {

            throw new BadRequestException(
                    "Employee code is required"
            );
        }

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new BadRequestException(
                    "Employee name is required"
            );
        }

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new BadRequestException(
                    "Employee email is required"
            );
        }


        // Check employee code

        if (employeeRepository
                .findByEmployeeCode(
                        request.getEmployeeCode()
                )
                .isPresent()) {

            throw new DuplicateResourceException(
                    "Employee code already exists: "
                            + request.getEmployeeCode()
            );
        }


        // Check email

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


        Employee employee =
                Employee.builder()
                        .employeeCode(
                                request.getEmployeeCode()
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
                        .build();


        Employee savedEmployee =
                employeeRepository.save(employee);


        // Create default leave balance

        LeaveBalance leaveBalance =
                LeaveBalance.builder()
                        .employee(savedEmployee)
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


        return mapToResponse(employee);
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


        Employee employee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + id
                                )
                        );


        // Check email belongs to another employee

        employeeRepository
                .findByEmail(request.getEmail())
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


        Employee updatedEmployee =
                employeeRepository.save(employee);


        return mapToResponse(
                updatedEmployee
        );
    }


    // =========================================================
    // DELETE EMPLOYEE
    // =========================================================

    @Override
    public void deleteEmployee(
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


        // Soft delete

        employee.setActive(false);

        employeeRepository.save(employee);
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

                .build();
    }
}