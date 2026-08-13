package com.hrm.payroll.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SalaryStructureRequest {

    private Long employeeId;

    private BigDecimal basicSalary;

    private BigDecimal hra;

    private BigDecimal specialAllowance;

    private BigDecimal pf;

    private BigDecimal esi;

    private BigDecimal professionalTax;

    private LocalDate effectiveFrom;
}