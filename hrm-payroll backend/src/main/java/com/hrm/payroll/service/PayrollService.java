package com.hrm.payroll.service;

import com.hrm.payroll.dto.PayrollProcessingResponse;
import com.hrm.payroll.dto.PayrollResponse;

import java.util.List;

public interface PayrollService {

    // =========================================================
    // GET PAYROLL BY ID
    // =========================================================

    PayrollResponse getById(Long id);


    // =========================================================
    // GET ALL PAYROLLS
    // =========================================================

    List<PayrollResponse> getAll();


    // =========================================================
    // GET PAYROLL BY EMPLOYEE
    // =========================================================

    List<PayrollResponse> getByEmployee(
            Long employeeId
    );


    // =========================================================
    // GET MY PAYROLL
    // =========================================================

    List<PayrollResponse> getMyPayroll(
            String username
    );


    // =========================================================
    // EXPORT PAYROLL TO EXCEL
    // =========================================================

    byte[] exportPayrollToExcel();


    // =========================================================
    // AUTOMATIC PAYROLL PROCESSING
    // =========================================================

    PayrollProcessingResponse processMonthlyPayroll();


    // =========================================================
    // AUTOMATIC PAYROLL PROCESSING
    // SELECTED MONTH
    // =========================================================

    PayrollProcessingResponse processMonthlyPayroll(
            String payPeriod
    );
}