package com.hrm.payroll.service.impl;

import com.hrm.payroll.entity.EmailLog;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.Payslip;
import com.hrm.payroll.repository.EmailLogRepository;
import com.hrm.payroll.service.EmailLogPersistenceService;
import com.hrm.payroll.service.EmailService;

import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    private final EmailLogRepository emailLogRepository;

    private final EmailLogPersistenceService
            emailLogPersistenceService;


    // =========================================================
    // SEND PAYSLIP EMAIL
    // =========================================================

    @Override
    public void sendPayslipEmail(
            Employee employee,
            Payslip payslip) {

        String email =
                employee.getEmail();


        // =====================================================
        // FIND EXISTING EMAIL LOG
        // =====================================================

        EmailLog existingEmailLog =
                emailLogRepository
                        .findByPayslipId(
                                payslip.getId()
                        )
                        .orElse(null);


        /*
         * If a log already exists, this is an automatic/manual
         * retry.
         *
         * If no log exists, this is the first email attempt
         * during payslip generation.
         */

        boolean isRetry =
                existingEmailLog != null;


        // =====================================================
        // CREATE / REUSE EMAIL LOG
        // =====================================================

        EmailLog emailLog;

        if (existingEmailLog != null) {

            emailLog =
                    existingEmailLog;

        } else {

            emailLog =
                    EmailLog.builder()
                            .employee(employee)
                            .payslip(payslip)
                            .email(email)
                            .retryCount(0)
                            .build();
        }


        try {

            // =================================================
            // CREATE EMAIL
            // =================================================

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true
                    );


            helper.setTo(email);


            helper.setSubject(
                    "Payslip - "
                            + payslip
                            .getPayroll()
                            .getPayPeriod()
            );


            helper.setText(
                    "Dear "
                            + employee.getName()
                            + ",\n\n"
                            + "Please find your payslip attached.\n\n"
                            + "Pay Period: "
                            + payslip
                            .getPayroll()
                            .getPayPeriod()
                            + "\n\n"
                            + "Regards,\n"
                            + "HR Department"
            );


            // =================================================
            // CHECK PDF
            // =================================================

            File pdfFile =
                    new File(
                            payslip.getFilePath()
                    );


            if (!pdfFile.exists()) {

                throw new RuntimeException(
                        "Payslip PDF not found: "
                                + payslip.getFilePath()
                );
            }


            // =================================================
            // ATTACH PDF
            // =================================================

            FileSystemResource attachment =
                    new FileSystemResource(
                            pdfFile
                    );


            helper.addAttachment(
                    payslip.getFileName(),
                    attachment
            );


            // =================================================
            // SEND EMAIL
            // =================================================

            mailSender.send(message);


            // =================================================
            // SUCCESS
            // =================================================

            emailLog.setEmployee(employee);

            emailLog.setPayslip(payslip);

            emailLog.setEmail(email);

            emailLog.setStatus("SENT");

            emailLog.setSentAt(
                    LocalDateTime.now()
            );

            emailLog.setErrorMessage(null);


            emailLogRepository.save(
                    emailLog
            );


            System.out.println(
                    "Payslip email sent successfully to: "
                            + email
            );


        } catch (Exception e) {

            // =================================================
            // FAILURE
            // =================================================

            if (isRetry) {

                // Existing payslip already exists in DB.
                // Separate transaction is safe.

                emailLogPersistenceService
                        .saveFailedEmailLogNewTransaction(
                                emailLog,
                                employee,
                                payslip,
                                email,
                                e
                        );

            } else {

                // First email attempt.
                // Use the current transaction.

                emailLogPersistenceService
                        .saveFailedEmailLog(
                                emailLog,
                                employee,
                                payslip,
                                email,
                                e
                        );
            }


            System.out.println(
                    "Payslip generated successfully, "
                            + "but email delivery failed for: "
                            + email
            );

            /*
             * IMPORTANT:
             *
             * Do NOT throw the email exception here.
             *
             * The payslip has already been generated.
             * The failed email is recorded in email_logs.
             * Scheduler will retry it automatically.
             */
        }
    }
}