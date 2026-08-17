package com.hrm.payroll.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentPayrollResponse {

    private Long payrollId;

    private String employeeName;

    private String department;

    private String payPeriod;

    private BigDecimal grossSalary;

    private BigDecimal netSalary;

    private String status;
}