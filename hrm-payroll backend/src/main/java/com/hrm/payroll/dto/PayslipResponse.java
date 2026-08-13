package com.hrm.payroll.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PayslipResponse {

    private Long id;

    private Long employeeId;

    private String employeeCode;

    private String employeeName;

    private String department;

    private String designation;

    private String payMonth;

    // Earnings
    private BigDecimal basicSalary;

    private BigDecimal hra;

    private BigDecimal specialAllowance;

    private BigDecimal grossSalary;

    // Deductions
    private BigDecimal pf;

    private BigDecimal esi;

    private BigDecimal professionalTax;

    private BigDecimal totalDeductions;

    // Leave summary
    private int casualLeave;

    private int sickLeave;

    private int earnedLeave;

    // Final amount
    private BigDecimal netSalary;

    private String status;
}