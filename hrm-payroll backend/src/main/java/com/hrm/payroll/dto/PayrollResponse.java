package com.hrm.payroll.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class PayrollResponse {

    private Long id;

    private Long employeeId;

    private String employeeCode;

    private String employeeName;

    private String department;

    private String payPeriod;

    private BigDecimal grossSalary;

    private BigDecimal totalDeductions;

    private BigDecimal netSalary;

    private String status;

    private LocalDateTime processedAt;
}