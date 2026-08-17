package com.hrm.payroll.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollScheduleResponse {

    private Long id;

    private boolean enabled;

    private String frequency;

    private LocalTime executionTime;

    private String payrollPeriod;

    private LocalDateTime lastExecutedAt;

    private LocalDateTime updatedAt;
}