package com.hrm.payroll.schedule;

import com.hrm.payroll.entity.PayrollSchedule;
import com.hrm.payroll.repository.PayrollScheduleRepository;
import com.hrm.payroll.service.PayrollService;

import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Component
@RequiredArgsConstructor
public class PayrollScheduler {


    private final PayrollService payrollService;

    private final PayrollScheduleRepository
            payrollScheduleRepository;


    // =========================================================
    // CHECK SCHEDULE EVERY MINUTE
    // =========================================================

    @Scheduled(fixedDelay = 60000)
    public void checkPayrollSchedule() {

        try {

            // =================================================
            // GET CURRENT SCHEDULE
            // =================================================

            PayrollSchedule schedule =
                    payrollScheduleRepository
                            .findAll()
                            .stream()
                            .findFirst()
                            .orElse(null);


            // =================================================
            // NO SCHEDULE
            // =================================================

            if (schedule == null) {

                System.out.println(
                        "No payroll schedule configured."
                );

                return;
            }


            // =================================================
            // CHECK ENABLED
            // =================================================

            if (!schedule.isEnabled()) {

                return;
            }


            // =================================================
            // CHECK EXECUTION TIME
            // =================================================

            LocalDateTime now =
                    LocalDateTime.now();

            LocalTime currentTime =
                    now.toLocalTime();

            LocalTime executionTime =
                    schedule.getExecutionTime();


            boolean timeMatches =
                    currentTime.getHour()
                            == executionTime.getHour()
                    &&
                    currentTime.getMinute()
                            == executionTime.getMinute();


            if (!timeMatches) {

                return;
            }


            // =================================================
            // PREVENT DUPLICATE EXECUTION
            // =================================================

            if (schedule.getLastExecutedAt() != null) {

                LocalDate lastExecutionDate =
                        schedule
                                .getLastExecutedAt()
                                .toLocalDate();


                if (lastExecutionDate.equals(
                        now.toLocalDate()
                )) {

                    return;
                }
            }


            // =================================================
            // GET FREQUENCY
            // =================================================

            String frequency =
                    schedule.getFrequency()
                            .trim()
                            .toUpperCase();


            boolean shouldRun = false;


            // =================================================
            // DAILY
            // =================================================

            if ("DAILY".equals(frequency)) {

                shouldRun = true;
            }


            // =================================================
            // MONTH END
            // =================================================

            else if ("MONTH_END".equals(frequency)) {

                LocalDate today =
                        now.toLocalDate();


                LocalDate lastDayOfMonth =
                        today.withDayOfMonth(
                                today.lengthOfMonth()
                        );


                shouldRun =
                        today.equals(
                                lastDayOfMonth
                        );
            }


            // =================================================
            // INVALID FREQUENCY
            // =================================================

            else {

                System.err.println(
                        "Invalid payroll frequency: "
                                + frequency
                );

                return;
            }


            // =================================================
            // RUN PAYROLL
            // =================================================

            if (shouldRun) {

                String payrollPeriod =
                        schedule.getPayrollPeriod();


                // -------------------------------------------------
                // VALIDATE PAYROLL PERIOD
                // -------------------------------------------------

                if (payrollPeriod == null ||
                        payrollPeriod.isBlank()) {

                    System.err.println(
                            "Payroll period is not configured."
                    );

                    return;
                }


                System.out.println(
                        "=========================================="
                );

                System.out.println(
                        "AUTOMATIC PAYROLL SCHEDULER TRIGGERED"
                );

                System.out.println(
                        "Frequency     : "
                                + frequency
                );

                System.out.println(
                        "Execution Time: "
                                + executionTime
                );

                System.out.println(
                        "Payroll Month : "
                                + payrollPeriod
                );

                System.out.println(
                        "=========================================="
                );


                try {

                    // ---------------------------------------------
                    // PROCESS SELECTED PAYROLL MONTH
                    // ---------------------------------------------

                    payrollService.processMonthlyPayroll(
                            payrollPeriod
                    );


                    // ---------------------------------------------
                    // UPDATE LAST EXECUTION
                    // ---------------------------------------------

                    schedule.setLastExecutedAt(
                            LocalDateTime.now()
                    );


                    payrollScheduleRepository.save(
                            schedule
                    );


                    System.out.println(
                            "=========================================="
                    );

                    System.out.println(
                            "AUTOMATIC PAYROLL COMPLETED"
                    );

                    System.out.println(
                            "Payroll Month: "
                                    + payrollPeriod
                    );

                    System.out.println(
                            "=========================================="
                    );


                } catch (Exception e) {

                    System.err.println(
                            "=========================================="
                    );

                    System.err.println(
                            "AUTOMATIC PAYROLL PROCESSING FAILED"
                    );

                    System.err.println(
                            "Payroll Month: "
                                    + payrollPeriod
                    );

                    System.err.println(
                            "Reason: "
                                    + e.getMessage()
                    );

                    System.err.println(
                            "=========================================="
                    );


                    e.printStackTrace();
                }
            }


        } catch (Exception e) {

            System.err.println(
                    "Payroll scheduler check failed."
            );

            System.err.println(
                    "Reason: "
                            + e.getMessage()
            );

            e.printStackTrace();
        }
    }
}