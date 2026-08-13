package com.hrm.payroll.service;

import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.Payslip;

public interface EmailService {

    void sendPayslipEmail(
            Employee employee,
            Payslip payslip
    );
}