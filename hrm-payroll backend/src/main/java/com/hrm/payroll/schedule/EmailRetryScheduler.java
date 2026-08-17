package com.hrm.payroll.schedule;

import com.hrm.payroll.entity.EmailLog;
import com.hrm.payroll.repository.EmailLogRepository;
import com.hrm.payroll.service.EmailLogService;

import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EmailRetryScheduler {

    private final EmailLogRepository emailLogRepository;

    private final EmailLogService emailLogService;


    // =========================================================
    // AUTOMATIC EMAIL RETRY
    // =========================================================

    @Scheduled(fixedDelay = 60000)
    public void retryFailedEmails() {

        System.out.println(
                "=============================================="
        );

        System.out.println(
                "Automatic email retry process started..."
        );


        List<EmailLog> failedEmails =
                emailLogRepository
                        .findByStatusAndRetryCountLessThan(
                                "FAILED",
                                3
                        );


        System.out.println(
                "Failed emails found for retry: "
                        + failedEmails.size()
        );


        for (EmailLog emailLog : failedEmails) {

            System.out.println(
                    "Retrying email log ID: "
                            + emailLog.getId()
                            + " | Email: "
                            + emailLog.getEmail()
                            + " | Status: "
                            + emailLog.getStatus()
                            + " | Retry Count: "
                            + emailLog.getRetryCount()
            );


            try {

                emailLogService.retryEmail(
                        emailLog.getId()
                );


                System.out.println(
                        "Email retry completed for log ID: "
                                + emailLog.getId()
                );

            } catch (Exception e) {

                System.out.println(
                        "Email retry failed for log ID: "
                                + emailLog.getId()
                                + " - "
                                + e.getMessage()
                );
            }
        }


        System.out.println(
                "Automatic email retry process completed."
        );

        System.out.println(
                "=============================================="
        );
    }}