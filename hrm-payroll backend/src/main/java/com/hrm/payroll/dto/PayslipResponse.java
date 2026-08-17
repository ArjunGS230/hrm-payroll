package com.hrm.payroll.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayslipResponse {

    private Long id;

    private Long employeeId;

    private String employeeCode;

    private String employeeName;

    private String email;

    private String department;

    private String designation;

    private LocalDate joiningDate;

    private String payMonth;

    private BigDecimal basicSalary;

    private BigDecimal hra;

    private BigDecimal specialAllowance;

    private BigDecimal grossSalary;

    private BigDecimal pf;

    private BigDecimal esi;

    private BigDecimal professionalTax;

    private BigDecimal totalDeductions;

    private BigDecimal netSalary;

    private Integer casualLeave;

    private Integer sickLeave;

    private Integer earnedLeave;

    private String status;

    // =========================================================
    // EMAIL INFORMATION
    // =========================================================

    private String emailStatus;

    private String message;
}