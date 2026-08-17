package com.hrm.payroll.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "payroll_schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // ENABLE / DISABLE SCHEDULER
    // =========================================================

    @Column(nullable = false)
    private boolean enabled;


    // =========================================================
    // FREQUENCY
    // DAILY / MONTH_END
    // =========================================================

    @Column(nullable = false)
    private String frequency;


    // =========================================================
    // EXECUTION TIME
    // Example: 22:30
    // =========================================================

    @Column(
            name = "execution_time",
            nullable = false
    )
    private LocalTime executionTime;


    // =========================================================
    // PAYROLL PERIOD / MONTH
    // Example:
    // 2026-08
    // 2026-09
    // =========================================================

    @Column(
            name = "payroll_period",
            nullable = false
    )
    private String payrollPeriod;


    // =========================================================
    // LAST EXECUTION
    // Used to prevent duplicate execution
    // =========================================================

    @Column(name = "last_executed_at")
    private LocalDateTime lastExecutedAt;


    // =========================================================
    // UPDATED TIME
    // =========================================================

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}