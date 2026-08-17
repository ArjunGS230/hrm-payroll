package com.hrm.payroll.service;

import com.hrm.payroll.entity.EmailLog;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.Payslip;

public interface EmailLogPersistenceService {

    // Used when the payslip is being generated
    void saveFailedEmailLog(
            EmailLog emailLog,
            Employee employee,
            Payslip payslip,
            String email,
            Exception exception
    );

    // Used by automatic retry
    void saveFailedEmailLogNewTransaction(
            EmailLog emailLog,
            Employee employee,
            Payslip payslip,
            String email,
            Exception exception
    );
}