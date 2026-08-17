package com.hrm.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private long totalEmployees;

    private BigDecimal monthlyPayroll;

    private long pendingLeaves;

    private long payslipsGenerated;

    private BigDecimal grossSalary;

    private BigDecimal netSalary;

    private BigDecimal deductions;
}