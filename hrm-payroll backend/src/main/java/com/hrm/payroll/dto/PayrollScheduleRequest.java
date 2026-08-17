package com.hrm.payroll.dto;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollScheduleRequest {

    private boolean enabled;

    private String frequency;

    private LocalTime executionTime;

    // Example: 2026-08
    private String payrollPeriod;
}