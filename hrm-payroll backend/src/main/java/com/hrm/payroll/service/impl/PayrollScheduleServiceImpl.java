package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.PayrollProcessingResponse;
import com.hrm.payroll.dto.PayrollScheduleRequest;
import com.hrm.payroll.dto.PayrollScheduleResponse;
import com.hrm.payroll.entity.PayrollSchedule;
import com.hrm.payroll.repository.PayrollScheduleRepository;
import com.hrm.payroll.service.PayrollScheduleService;
import com.hrm.payroll.service.PayrollService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;


@Service
@RequiredArgsConstructor
public class PayrollScheduleServiceImpl
        implements PayrollScheduleService {


    private final PayrollScheduleRepository
            payrollScheduleRepository;

    private final PayrollService payrollService;


    // =========================================================
    // GET CURRENT SCHEDULE
    // =========================================================

    @Override
    @Transactional
    public PayrollScheduleResponse getSchedule() {

        PayrollSchedule schedule =
                payrollScheduleRepository
                        .findAll()
                        .stream()
                        .findFirst()
                        .orElseGet(
                                this::createDefaultSchedule
                        );


        return mapToResponse(schedule);
    }


    // =========================================================
    // SAVE / UPDATE SCHEDULE
    // =========================================================

    @Override
    @Transactional
    public PayrollScheduleResponse saveSchedule(
            PayrollScheduleRequest request) {


        // =====================================================
        // VALIDATE REQUEST
        // =====================================================

        if (request == null) {

            throw new IllegalArgumentException(
                    "Schedule request is required."
            );
        }


        // =====================================================
        // VALIDATE PAYROLL MONTH
        // =====================================================

        if (request.getPayrollPeriod() == null ||
                request.getPayrollPeriod().isBlank()) {

            throw new IllegalArgumentException(
                    "Payroll month is required."
            );
        }


        String payrollPeriod =
                request.getPayrollPeriod()
                        .trim();


        // -----------------------------------------------------
        // Validate YYYY-MM format
        // -----------------------------------------------------

        try {

            YearMonth.parse(
                    payrollPeriod
            );

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Invalid payroll month. "
                            + "Use YYYY-MM format."
            );
        }


        // =====================================================
        // VALIDATE FREQUENCY
        // =====================================================

        if (request.getFrequency() == null ||
                request.getFrequency().isBlank()) {

            throw new IllegalArgumentException(
                    "Frequency is required."
            );
        }


        String frequency =
                request.getFrequency()
                        .trim()
                        .toUpperCase();


        if (!frequency.equals("DAILY") &&
                !frequency.equals("MONTH_END")) {

            throw new IllegalArgumentException(
                    "Frequency must be DAILY or MONTH_END."
            );
        }


        // =====================================================
        // VALIDATE EXECUTION TIME
        // =====================================================

        if (request.getExecutionTime() == null) {

            throw new IllegalArgumentException(
                    "Execution time is required."
            );
        }


        // =====================================================
        // GET EXISTING SCHEDULE
        // =====================================================

        PayrollSchedule schedule =
                payrollScheduleRepository
                        .findAll()
                        .stream()
                        .findFirst()
                        .orElseGet(
                                PayrollSchedule::new
                        );


        // =====================================================
        // UPDATE SCHEDULE
        // =====================================================

        schedule.setEnabled(
                request.isEnabled()
        );


        schedule.setFrequency(
                frequency
        );


        schedule.setExecutionTime(
                request.getExecutionTime()
        );


        schedule.setPayrollPeriod(
                payrollPeriod
        );


        schedule.setUpdatedAt(
                LocalDateTime.now()
        );


        // =====================================================
        // SAVE
        // =====================================================

        PayrollSchedule saved =
                payrollScheduleRepository.save(
                        schedule
                );


        // =====================================================
        // LOG
        // =====================================================

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "PAYROLL SCHEDULE UPDATED"
        );

        System.out.println(
                "Enabled       : "
                        + saved.isEnabled()
        );

        System.out.println(
                "Frequency     : "
                        + saved.getFrequency()
        );

        System.out.println(
                "Time          : "
                        + saved.getExecutionTime()
        );

        System.out.println(
                "Payroll Month : "
                        + saved.getPayrollPeriod()
        );

        System.out.println(
                "=========================================="
        );


        return mapToResponse(saved);
    }


    // =========================================================
    // RUN NOW
    // =========================================================

   
 // =========================================================
 // RUN NOW
 // =========================================================

 @Override
 public PayrollProcessingResponse runNow() {

     System.out.println(
             "=========================================="
     );

     System.out.println(
             "MANUAL AUTOMATIC PAYROLL RUN STARTED"
     );

     System.out.println(
             "=========================================="
     );


     // ---------------------------------------------------------
     // GET CURRENT SCHEDULE
     // ---------------------------------------------------------

     PayrollSchedule schedule =
             payrollScheduleRepository
                     .findAll()
                     .stream()
                     .findFirst()
                     .orElse(null);


     if (schedule == null) {

         throw new IllegalStateException(
                 "Payroll schedule is not configured."
         );
     }


     // ---------------------------------------------------------
     // GET SELECTED PAYROLL MONTH
     // ---------------------------------------------------------

     String payrollPeriod =
             schedule.getPayrollPeriod();


     if (payrollPeriod == null ||
             payrollPeriod.isBlank()) {

         throw new IllegalStateException(
                 "Payroll month is not configured."
         );
     }


     System.out.println(
             "Payroll Month: "
                     + payrollPeriod
     );


     // ---------------------------------------------------------
     // PROCESS PAYROLL
     // ---------------------------------------------------------

     PayrollProcessingResponse response =
             payrollService.processMonthlyPayroll(
                     payrollPeriod
             );


     System.out.println(
             "=========================================="
     );

     System.out.println(
             "MANUAL PAYROLL RUN COMPLETED"
     );

     System.out.println(
             "Generated : "
                     + response.getSuccessful()
     );

     System.out.println(
             "Skipped   : "
                     + response.getSkipped()
     );

     System.out.println(
             "Failed    : "
                     + response.getFailed()
     );

     System.out.println(
             "=========================================="
     );


     return response;
 }

    // =========================================================
    // CREATE DEFAULT SCHEDULE
    // =========================================================

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    private PayrollSchedule createDefaultSchedule() {

        PayrollSchedule schedule =
                PayrollSchedule.builder()

                        .enabled(true)

                        .frequency(
                                "MONTH_END"
                        )

                        .executionTime(
                                LocalTime.of(
                                        23,
                                        59
                                )
                        )

                        .payrollPeriod(
                                YearMonth
                                        .now()
                                        .toString()
                        )

                        .updatedAt(
                                LocalDateTime.now()
                        )

                        .build();


        return payrollScheduleRepository.save(
                schedule
        );
    }


    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private PayrollScheduleResponse mapToResponse(
            PayrollSchedule schedule) {

        return PayrollScheduleResponse.builder()

                .id(
                        schedule.getId()
                )

                .enabled(
                        schedule.isEnabled()
                )

                .frequency(
                        schedule.getFrequency()
                )

                .executionTime(
                        schedule.getExecutionTime()
                )

                .payrollPeriod(
                        schedule.getPayrollPeriod()
                )

                .lastExecutedAt(
                        schedule.getLastExecutedAt()
                )

                .updatedAt(
                        schedule.getUpdatedAt()
                )

                .build();
    }
}