package com.hrm.payroll.service;

import com.hrm.payroll.dto.PayslipResponse;

import java.util.List;

public interface PayslipService {

    PayslipResponse generatePayslip(
            Long employeeId,
            String payPeriod
    );

    PayslipResponse getPayslipById(Long id);

    List<PayslipResponse> getEmployeePayslips(
            Long employeeId
    );

    List<PayslipResponse> getAllPayslips();

    void sendPayslipEmail(Long payslipId);

    // Employee's own payslips
    List<PayslipResponse> getMyPayslips(
            String username
    );
}