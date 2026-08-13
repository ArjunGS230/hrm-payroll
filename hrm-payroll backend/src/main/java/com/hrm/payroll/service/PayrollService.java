package com.hrm.payroll.service;

import com.hrm.payroll.dto.PayrollResponse;

import java.util.List;

public interface PayrollService {

    PayrollResponse getById(Long id);

    List<PayrollResponse> getAll();

    List<PayrollResponse> getByEmployee(Long employeeId);
}