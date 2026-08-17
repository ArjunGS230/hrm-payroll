package com.hrm.payroll.service.impl;

import com.hrm.payroll.entity.EmailLog;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.Payslip;
import com.hrm.payroll.repository.EmailLogRepository;
import com.hrm.payroll.service.EmailLogPersistenceService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmailLogPersistenceServiceImpl
        implements EmailLogPersistenceService {


    private final EmailLogRepository emailLogRepository;


    // =========================================================
    // INITIAL EMAIL FAILURE
    // =========================================================

    @Override
    @Transactional
    public void saveFailedEmailLog(
            EmailLog emailLog,
            Employee employee,
            Payslip payslip,
            String email,
            Exception exception) {

        emailLog.setEmployee(employee);

        emailLog.setPayslip(payslip);

        emailLog.setEmail(email);

        emailLog.setStatus("FAILED");

        emailLog.setSentAt(null);

        emailLog.setErrorMessage(
                exception.getMessage()
        );


        Integer retryCount =
                emailLog.getRetryCount();

        if (retryCount == null) {
            retryCount = 0;
        }


        emailLog.setRetryCount(
                retryCount + 1
        );


        emailLogRepository.save(
                emailLog
        );


        System.out.println(
                "FAILED EMAIL LOG SAVED"
        );

        System.out.println(
                "Email: " + email
        );

        System.out.println(
                "Retry Count: "
                        + emailLog.getRetryCount()
        );
    }


    // =========================================================
    // AUTOMATIC RETRY FAILURE
    // =========================================================

    @Override
    @Transactional(
            propagation = Propagation.REQUIRES_NEW
    )
    public void saveFailedEmailLogNewTransaction(
            EmailLog emailLog,
            Employee employee,
            Payslip payslip,
            String email,
            Exception exception) {

        emailLog.setEmployee(employee);

        emailLog.setPayslip(payslip);

        emailLog.setEmail(email);

        emailLog.setStatus("FAILED");

        emailLog.setSentAt(null);

        emailLog.setErrorMessage(
                exception.getMessage()
        );


        Integer retryCount =
                emailLog.getRetryCount();

        if (retryCount == null) {
            retryCount = 0;
        }


        emailLog.setRetryCount(
                retryCount + 1
        );


        emailLogRepository.saveAndFlush(
                emailLog
        );


        System.out.println(
                "FAILED EMAIL LOG SAVED "
                        + "IN NEW TRANSACTION"
        );

        System.out.println(
                "Email: " + email
        );

        System.out.println(
                "Retry Count: "
                        + emailLog.getRetryCount()
        );
    }
}