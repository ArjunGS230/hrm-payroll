package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.PayrollResponse;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.Payroll;
import com.hrm.payroll.exception.ResourceNotFoundException;
import com.hrm.payroll.repository.PayrollRepository;
import com.hrm.payroll.service.PayrollService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;


    @Override
    public PayrollResponse getById(Long id) {

        Payroll payroll =
                payrollRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payroll not found with id: " + id
                                )
                        );

        return mapToResponse(payroll);
    }


    @Override
    public List<PayrollResponse> getAll() {

        return payrollRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public List<PayrollResponse> getByEmployee(
            Long employeeId) {

        return payrollRepository
                .findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    private PayrollResponse mapToResponse(
            Payroll payroll) {

        Employee employee =
                payroll.getEmployee();

        return PayrollResponse.builder()

                .id(
                        payroll.getId()
                )

                .employeeId(
                        employee.getId()
                )

                .employeeCode(
                        employee.getEmployeeCode()
                )

                .employeeName(
                        employee.getName()
                )

                .department(
                        employee.getDepartment()
                )

                .payPeriod(
                        payroll.getPayPeriod()
                )

                .grossSalary(
                        payroll.getGrossSalary()
                )

                .totalDeductions(
                        payroll.getTotalDeductions()
                )

                .netSalary(
                        payroll.getNetSalary()
                )

                .status(
                        payroll.getStatus()
                )

                .processedAt(
                        payroll.getProcessedAt()
                )

                .build();
    }
}