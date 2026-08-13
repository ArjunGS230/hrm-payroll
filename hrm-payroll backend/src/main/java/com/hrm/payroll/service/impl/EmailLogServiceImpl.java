package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.EmailLogResponse;
import com.hrm.payroll.entity.EmailLog;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.Payslip;
import com.hrm.payroll.exception.ResourceNotFoundException;
import com.hrm.payroll.repository.EmailLogRepository;
import com.hrm.payroll.service.EmailLogService;
import com.hrm.payroll.service.EmailService;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmailLogServiceImpl implements EmailLogService {

	private final EmailLogRepository emailLogRepository;

	private final EmailService emailService;
	@Override
	@Transactional
	public void retryEmail(Long id) {

	    EmailLog emailLog = emailLogRepository
	            .findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "Email log not found with id: " + id
	                    )
	            );

	    if (!"FAILED".equalsIgnoreCase(emailLog.getStatus())) {

	        throw new IllegalStateException(
	                "Only failed emails can be retried"
	        );
	    }

	    Employee employee = emailLog.getEmployee();

	    Payslip payslip = emailLog.getPayslip();

	    emailService.sendPayslipEmail(
	            employee,
	            payslip
	    );
	}

    @Override
    public List<EmailLogResponse> getAllEmailLogs() {

        return emailLogRepository
                .findAllByOrderBySentAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public List<EmailLogResponse> getAllLogs() {

        return emailLogRepository
                .findAllByOrderBySentAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public EmailLogResponse getById(Long id) {

        EmailLog emailLog =
                emailLogRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Email log not found with id: " + id
                                )
                        );

        return mapToResponse(emailLog);
    }


    private EmailLogResponse mapToResponse(
            EmailLog emailLog) {

        Employee employee = emailLog.getEmployee();

        Payslip payslip = emailLog.getPayslip();

        return EmailLogResponse.builder()

                .id(
                        emailLog.getId()
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

                .email(
                        emailLog.getEmail()
                )

                .payslipId(
                        payslip.getId()
                )

                .payPeriod(
                        payslip
                                .getPayroll()
                                .getPayPeriod()
                )

                .status(
                        emailLog.getStatus()
                )

                .sentAt(
                        emailLog.getSentAt()
                )

                .errorMessage(
                        emailLog.getErrorMessage()
                )

                .retryCount(
                        emailLog.getRetryCount()
                )

                .build();
    }
}