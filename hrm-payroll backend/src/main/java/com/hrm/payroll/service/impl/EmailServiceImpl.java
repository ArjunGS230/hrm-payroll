package com.hrm.payroll.service.impl;

import com.hrm.payroll.entity.EmailLog;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.Payslip;
import com.hrm.payroll.repository.EmailLogRepository;
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


    @Override
    public void sendPayslipEmail(
            Employee employee,
            Payslip payslip) {

        String email = employee.getEmail();

        /*
         * Check whether an email log already exists
         * for this payslip.
         */
        EmailLog emailLog =
                emailLogRepository
                        .findByPayslipId(payslip.getId())
                        .orElse(
                                EmailLog.builder()
                                        .employee(employee)
                                        .payslip(payslip)
                                        .email(email)
                                        .retryCount(0)
                                        .build()
                        );


        try {

            // ==========================================
            // CREATE EMAIL
            // ==========================================

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


            // ==========================================
            // CHECK PDF
            // ==========================================

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


            // ==========================================
            // ATTACH PDF
            // ==========================================

            FileSystemResource attachment =
                    new FileSystemResource(
                            pdfFile
                    );


            helper.addAttachment(
                    payslip.getFileName(),
                    attachment
            );


            // ==========================================
            // SEND EMAIL
            // ==========================================

            mailSender.send(message);


            // ==========================================
            // UPDATE EMAIL LOG
            // ==========================================

            emailLog.setEmployee(employee);
            emailLog.setPayslip(payslip);
            emailLog.setEmail(email);
            emailLog.setStatus("SENT");
            emailLog.setSentAt(
                    LocalDateTime.now()
            );
            emailLog.setErrorMessage(null);


            emailLogRepository.save(emailLog);


            System.out.println(
                    "Payslip email sent successfully to: "
                            + email
            );

        } catch (Exception e) {

            /*
             * IMPORTANT:
             * Do not create a new EmailLog here.
             *
             * Reuse the existing log if it already exists.
             */

            emailLog.setEmployee(employee);
            emailLog.setPayslip(payslip);
            emailLog.setEmail(email);
            emailLog.setStatus("FAILED");
            emailLog.setErrorMessage(
                    e.getMessage()
            );

            Integer retryCount =
                    emailLog.getRetryCount();

            if (retryCount == null) {
                retryCount = 0;
            }

            emailLog.setRetryCount(
                    retryCount + 1
            );


            /*
             * Save the same EmailLog record.
             */
            emailLogRepository.save(emailLog);


            throw new RuntimeException(
                    "Failed to send payslip email: "
                            + e.getMessage(),
                    e
            );
        }
    }
}